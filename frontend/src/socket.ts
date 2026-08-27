// frontend/src/socket.ts
import { io, Socket } from "socket.io-client";
import type { PublicGameState, SecretRoleData } from "./types";

interface ServerToClientEvents {
  room_updated: (data: PublicGameState) => void;
  secret_role: (data: SecretRoleData) => void;
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
  start_game: (callback: (response: { success: boolean; error?: string }) => void) => void;
  submit_clue: (
    data: { clue: string },
    callback: (response: { success: boolean; error?: string }) => void
  ) => void;
  cast_vote: (
    data: { targetId: string },
    callback: (response: { success: boolean; error?: string }) => void
  ) => void;
  restart_game: (callback: (response: { success: boolean; error?: string }) => void) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:5000", {
  autoConnect: true,
});