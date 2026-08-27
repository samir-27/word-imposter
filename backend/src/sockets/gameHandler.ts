// backend/src/sockets/gameHandler.ts
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../types/socket.js";
import { startGame, submitClue, getPublicGameState } from "../game/roomStore.js";

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function registerGameHandlers(io: TypedServer, socket: TypedSocket): void {
  // 1. START GAME
  socket.on("start_game", (callback) => {
    const { roomCode, playerId } = socket.data;
    if (!roomCode || !playerId) {
      return callback({ success: false, error: "Unauthorized or missing room context." });
    }

    try {
      const room = startGame(roomCode, playerId);

      // Distribute private roles
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
  });

  // 2. SUBMIT CLUE
  socket.on("submit_clue", ({ clue }, callback) => {
    const { roomCode, playerId } = socket.data;
    if (!roomCode || !playerId) {
      return callback({ success: false, error: "Unauthorized or missing room context." });
    }

    try {
      const room = submitClue(roomCode, playerId, clue);
      
      // Broadcast updated clues & game state to all players in the room
      io.to(room.roomCode).emit("room_updated", getPublicGameState(room));
      callback({ success: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit clue.";
      callback({ success: false, error: message });
    }
  });
}