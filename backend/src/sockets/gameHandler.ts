// backend/src/sockets/gameHandler.ts
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../types/socket.js";
import { startGame, getPublicGameState } from "../game/roomStore.js";

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function registerGameHandlers(io: TypedServer, socket: TypedSocket): void {
  socket.on("start_game", (callback) => {
    const { roomCode, playerId } = socket.data;

    if (!roomCode || !playerId) {
      return callback({ success: false, error: "Unauthorized or missing room context." });
    }

    try {
      // 1. Validate & transition game state
      const room = startGame(roomCode, playerId);

      // 2. Send private role and word to each player individually
      room.players.forEach((player) => {
        const isImposter = player.id === room.imposterId;
        const secretWord = isImposter ? room.wordPair.imposterWord : room.wordPair.innocentWord;

        io.to(player.socketId).emit("secret_role", {
          role: isImposter ? "IMPOSTER" : "INNOCENT",
          word: secretWord,
          category: room.wordPair.category,
        });
      });

      // 3. Broadcast sanitized game state to all players in the room
      const publicState = getPublicGameState(room);
      io.to(room.roomCode).emit("room_updated", publicState);

      callback({ success: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to start game.";
      callback({ success: false, error: message });
    }
  });
}