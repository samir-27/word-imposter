// backend/src/sockets/index.ts
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../types/socket.js";
import { registerRoomHandlers } from "./roomHandler.js";

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function initializeSockets(io: TypedServer): void {
  io.on("connection", (socket) => {
    console.log(`🔌 [Connected] Socket ID: ${socket.id}`);

    // Register modular handlers
    registerRoomHandlers(io, socket);
    
    // As we build the game, we will add:
    // registerGameHandlers(io, socket);
    // registerVotingHandlers(io, socket);
  });
}