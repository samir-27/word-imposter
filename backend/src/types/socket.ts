// backend/src/types/socket.ts

export interface Player {
  id: string;        // Unique permanent ID for this session
  socketId: string;  // Active socket connection ID
  name: string;      // Display name
  isHost: boolean;
}

export type GameState = 
  | "LOBBY"
  | "ROUND_1"
  | "ROUND_2"
  | "VOTING_1"
  | "ROUND_3"
  | "FINAL_VOTING"
  | "GAME_OVER";

export interface RoomData {
  roomCode: string;
  hostId: string;
  gameState: GameState;
  players: Player[];
}

// Events emitted FROM Client TO Server
export interface ClientToServerEvents {
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

// Events emitted FROM Server TO Client
export interface ServerToClientEvents {
  room_updated: (data: RoomData) => void;
  error_message: (data: { message: string }) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  playerId?: string;
  roomCode?: string;
}