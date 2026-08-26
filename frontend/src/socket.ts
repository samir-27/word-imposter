import { io, Socket } from "socket.io-client";

// Define the exact same event interfaces for end-to-end type safety
interface ServerToClientEvents {
  pong_client: (data: { message: string; timestamp: number }) => void;
}

interface ClientToServerEvents {
  ping_server: (data: { message: string }) => void;
}

const SERVER_URL = "http://localhost:5000";

// Export typed socket instance
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SERVER_URL, {
  autoConnect: true,
});