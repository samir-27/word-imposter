// Events emitted FROM Client TO Server
export interface ClientToServerEvents {
  ping_server: (data: { message: string }) => void;
}

// Events emitted FROM Server TO Client
export interface ServerToClientEvents {
  pong_client: (data: { message: string; timestamp: number }) => void;
}

// Inter-server events
export interface InterServerEvents {}

// Custom data stored on the socket instance itself
export interface SocketData {
  userId?: string;
  roomId?: string;
}