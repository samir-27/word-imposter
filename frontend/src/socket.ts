import { io, Socket } from "socket.io-client";
import type { RoomData } from "./types";

interface ServerToClientEvents {
  room_updated: (data: RoomData) => void;
  error_message: (data: { message: string }) => void;
}

interface ClientToServerEvents {
  create_room: (
    data: { playerName: string },
    callback: (response: { success: boolean; roomCode?: string; error?: string }) => void
  ) => void;
  join_room: (
    data: { roomCode: string; playerName: string },
    callback: (response: { success: boolean; error?: string }) => void
  ) => void;
  leave_room: () => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:5000", {
  autoConnect: true,
});