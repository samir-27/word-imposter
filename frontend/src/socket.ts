// frontend/src/socket.ts
import { io, Socket } from "socket.io-client";
import type { PublicGameState, SecretRoleData } from "./types";

interface ServerToClientEvents {
  room_updated: (data: PublicGameState) => void;
  secret_role: (data: SecretRoleData) => void;
  timer_tick: (data: { secondsRemaining: number }) => void;
  error_message: (data: { message: string }) => void;
}

interface ClientToServerEvents {
  create_room: (
    data: { playerName: string },
    callback: (response: { success: boolean; roomCode?: string; sessionToken?: string; error?: string }) => void
  ) => void;
  join_room: (
    data: { roomCode: string; playerName: string },
    callback: (response: { success: boolean; sessionToken?: string; error?: string }) => void
  ) => void;
  reconnect_session: (
    data: { roomCode: string; sessionToken: string },
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

const currentHost = window.location.hostname;
const SERVER_URL = `http://${currentHost}:5000`;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SERVER_URL, {
  autoConnect: true,
});