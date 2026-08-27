// backend/src/sockets/gameHandler.ts
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../types/socket.js";
import { startGame, submitClue, castVote, getPublicGameState } from "../game/roomStore.js";

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function registerGameHandlers(io: TypedServer, socket: TypedSocket): void {
  // START / RESTART GAME
  const handleStart = (callback: (response: { success: boolean; error?: string }) => void) => {
    const { roomCode, playerId } = socket.data;
    if (!roomCode || !playerId) {
      return callback({ success: false, error: "Unauthorized or missing room context." });
    }

    try {
      const room = startGame(roomCode, playerId);

      room.players.forEach((player) => {
        const isImposter = player.id === room.imposterId;
        const secretWord = isImposter ? room.wordPair.imposterWord : room.wordPair.innocentWord;

        io.to(player.socketId).emit("secret_role", {
          role: isImposter ? "IMPOSTER" : "INNOCENT",
          word: secretWord,
          category: room.wordPair.category,
        });
      });

      io.to(room.roomCode).emit("room_updated", getPublicGameState(room));
      callback({ success: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to start game.";
      callback({ success: false, error: message });
    }
  };

  socket.on("start_game", handleStart);
  socket.on("restart_game", handleStart);

  // SUBMIT CLUE
  socket.on("submit_clue", ({ clue }, callback) => {
    const { roomCode, playerId } = socket.data;
    if (!roomCode || !playerId) {
      return callback({ success: false, error: "Unauthorized or missing room context." });
    }

    try {
      const room = submitClue(roomCode, playerId, clue);
      io.to(room.roomCode).emit("room_updated", getPublicGameState(room));
      callback({ success: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit clue.";
      callback({ success: false, error: message });
    }
  });

  // CAST VOTE
  socket.on("cast_vote", ({ targetId }, callback) => {
    const { roomCode, playerId } = socket.data;
    if (!roomCode || !playerId) {
      return callback({ success: false, error: "Unauthorized or missing room context." });
    }

    try {
      const room = castVote(roomCode, playerId, targetId);
      io.to(room.roomCode).emit("room_updated", getPublicGameState(room));
      callback({ success: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to cast vote.";
      callback({ success: false, error: message });
    }
  });
}