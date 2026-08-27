export interface Player {
  id: string;
  socketId: string;
  name: string;
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