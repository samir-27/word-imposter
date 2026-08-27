// frontend/src/types.ts

export type Role = "INNOCENT" | "IMPOSTER";

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

export interface ClueEntry {
  playerId: string;
  playerName: string;
  clue: string;
  round: 1 | 2 | 3;
}

export interface PublicGameState {
  roomCode: string;
  hostId: string;
  gameState: GameState;
  players: Player[];
  currentRound: number;
  category: string;
  clues: ClueEntry[];
}

export interface SecretRoleData {
  role: Role;
  word: string;
  category: string;
}