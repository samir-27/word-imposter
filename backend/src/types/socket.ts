// backend/src/types/socket.ts

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

export interface WordPair {
  id: string;
  category: string;
  innocentWord: string;
  imposterWord: string;
}

export interface ClueEntry {
  playerId: string;
  playerName: string;
  clue: string;
  round: 1 | 2 | 3;
}

export interface VoteTally {
  targetId: string;
  targetName: string;
  count: number;
}

export interface GameResult {
  winner: "PLAYERS" | "IMPOSTER";
  reason: string;
  imposterId: string;
  imposterName: string;
  innocentWord: string;
  imposterWord: string;
  voteTallies: VoteTally[];
}

export interface ActiveGame {
  roomCode: string;
  hostId: string;
  gameState: GameState;
  players: Player[];
  imposterId: string;
  wordPair: WordPair;
  clues: ClueEntry[];
  votes: { voterId: string; targetId: string; round: 1 | 2 }[];
  gameResult: GameResult | null;
  currentTurnIndex: number; // Index in players array whose turn it is to give a clue
  timerSecondsRemaining: number;
}

export interface PublicGameState {
  roomCode: string;
  hostId: string;
  gameState: GameState;
  players: Player[];
  currentRound: number;
  category: string;
  clues: ClueEntry[];
  currentTurnPlayerId: string | null;
  timerSecondsRemaining: number;
  votedPlayerIds: string[];
  gameResult: GameResult | null;
}

export interface SecretRoleData {
  role: Role;
  word: string;
  category: string;
}

// Client -> Server
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

// Server -> Client
export interface ServerToClientEvents {
  room_updated: (data: PublicGameState) => void;
  secret_role: (data: SecretRoleData) => void;
  timer_tick: (data: { secondsRemaining: number }) => void;
  error_message: (data: { message: string }) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  playerId?: string;
  roomCode?: string;
}