// backend/src/sockets/roomHandler.ts
import crypto from "crypto";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  Player,
} from "../types/socket.js";
import {
  createRoom,
  getRoom,
  addPlayerToRoom,
  handlePlayerDisconnect,
  reconnectPlayer,
  removePlayerPermanently,
  getPublicGameState,
} from "../game/roomStore.js";

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function registerRoomHandlers(io: TypedServer, socket: TypedSocket): void {
  // 1. CREATE ROOM
  socket.on("create_room", ({ playerName }, callback) => {
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      return callback({ success: false, error: "Player name is required." });
    }

    const playerId = crypto.randomUUID();
    const sessionToken = crypto.randomBytes(16).toString("hex");

    const hostPlayer: Player = {
      id: playerId,
      socketId: socket.id,
      sessionToken,
      name: trimmedName,
      isHost: true,
      isConnected: true,
    };

    const room = createRoom(hostPlayer);

    socket.data.playerId = playerId;
    socket.data.sessionToken = sessionToken;
    socket.data.roomCode = room.roomCode;
    socket.join(room.roomCode);

    callback({ success: true, roomCode: room.roomCode, sessionToken });
    io.to(room.roomCode).emit("room_updated", getPublicGameState(room));
  });

  // 2. JOIN ROOM
  socket.on("join_room", ({ roomCode, playerName }, callback) => {
    const cleanCode = roomCode.trim().toUpperCase();
    const trimmedName = playerName.trim();

    if (!cleanCode || !trimmedName) {
      return callback({ success: false, error: "Room code and name are required." });
    }

    const room = getRoom(cleanCode);
    if (!room) {
      return callback({ success: false, error: "Room not found. Check the code." });
    }

    if (room.gameState !== "LOBBY") {
      return callback({ success: false, error: "Game is already in progress." });
    }

    const playerId = crypto.randomUUID();
    const sessionToken = crypto.randomBytes(16).toString("hex");

    const newPlayer: Player = {
      id: playerId,
      socketId: socket.id,
      sessionToken,
      name: trimmedName,
      isHost: false,
      isConnected: true,
    };

    const updatedRoom = addPlayerToRoom(cleanCode, newPlayer);
    if (!updatedRoom) {
      return callback({ success: false, error: "Could not join room." });
    }

    socket.data.playerId = playerId;
    socket.data.sessionToken = sessionToken;
    socket.data.roomCode = cleanCode;
    socket.join(cleanCode);

    callback({ success: true, sessionToken });
    io.to(cleanCode).emit("room_updated", getPublicGameState(updatedRoom));
  });

  // 3. RECONNECT SESSION (After page refresh or app reload)
  socket.on("reconnect_session", ({ roomCode, sessionToken }, callback) => {
    const cleanCode = roomCode.trim().toUpperCase();
    const result = reconnectPlayer(cleanCode, sessionToken, socket.id);

    if (!result) {
      return callback({ success: false, error: "Session expired or invalid room." });
    }

    socket.data.playerId = result.player.id;
    socket.data.sessionToken = sessionToken;
    socket.data.roomCode = cleanCode;
    socket.join(cleanCode);

    // Re-send secret role data if game is active
    if (result.secret) {
      socket.emit("secret_role", result.secret);
    }

    // Broadcast updated connected status
    io.to(cleanCode).emit("room_updated", getPublicGameState(result.room));
    callback({ success: true });
  });

  // 4. LEAVE ROOM (Explicit click by user)
  socket.on("leave_room", () => {
    const { roomCode, playerId } = socket.data;
    if (roomCode && playerId) {
      socket.leave(roomCode);
      const updatedRoom = removePlayerPermanently(roomCode, playerId);
      if (updatedRoom) {
        io.to(roomCode).emit("room_updated", getPublicGameState(updatedRoom));
      }
      socket.data.roomCode = undefined;
      socket.data.playerId = undefined;
      socket.data.sessionToken = undefined;
    }
  });

  // 5. DISCONNECT (Grace period start)
  socket.on("disconnect", () => {
    const { roomCode, playerId } = socket.data;
    if (roomCode && playerId) {
      const updatedRoom = handlePlayerDisconnect(roomCode, playerId, () => {
        const current = getRoom(roomCode);
        if (current) {
          io.to(roomCode).emit("room_updated", getPublicGameState(current));
        }
      });
      if (updatedRoom) {
        io.to(roomCode).emit("room_updated", getPublicGameState(updatedRoom));
      }
    }
  });
}