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
  removePlayerFromRoom,
  getPublicGameState,
} from "../game/roomStore.js";

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function registerRoomHandlers(io: TypedServer, socket: TypedSocket): void {
  // 1. Create Room
  socket.on("create_room", ({ playerName }, callback) => {
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      return callback({ success: false, error: "Player name is required." });
    }

    const playerId = crypto.randomUUID();
    const hostPlayer: Player = {
      id: playerId,
      socketId: socket.id,
      name: trimmedName,
      isHost: true,
    };

    const room = createRoom(hostPlayer);

    socket.data.playerId = playerId;
    socket.data.roomCode = room.roomCode;
    socket.join(room.roomCode);

    callback({ success: true, roomCode: room.roomCode });
    io.to(room.roomCode).emit("room_updated", getPublicGameState(room));
  });

  // 2. Join Room
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
    const newPlayer: Player = {
      id: playerId,
      socketId: socket.id,
      name: trimmedName,
      isHost: false,
    };

    const updatedRoom = addPlayerToRoom(cleanCode, newPlayer);
    if (!updatedRoom) {
      return callback({ success: false, error: "Could not join room." });
    }

    socket.data.playerId = playerId;
    socket.data.roomCode = cleanCode;
    socket.join(cleanCode);

    callback({ success: true });
    io.to(cleanCode).emit("room_updated", updatedRoom);
  });

  // 3. Leave Room & Disconnect handler
  const handleLeave = () => {
    const { roomCode, playerId } = socket.data;
    if (roomCode && playerId) {
      socket.leave(roomCode);
      const updatedRoom = removePlayerFromRoom(roomCode, playerId);
      if (updatedRoom) {
        io.to(roomCode).emit("room_updated", updatedRoom);
      }
      socket.data.roomCode = undefined;
      socket.data.playerId = undefined;
    }
  };

  socket.on("leave_room", handleLeave);
  socket.on("disconnect", handleLeave);
}