// backend/src/game/roomStore.ts
import { ActiveGame, Player, PublicGameState } from "../types/socket.js";
import { getRandomWordPair } from "./wordBank.js";

const rooms = new Map<string, ActiveGame>();

export function generateRoomCode(): string {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return rooms.has(code) ? generateRoomCode() : code;
}

export function createRoom(hostPlayer: Player): ActiveGame {
  const roomCode = generateRoomCode();
  const defaultWordPair = getRandomWordPair();

  const newGame: ActiveGame = {
    roomCode,
    hostId: hostPlayer.id,
    gameState: "LOBBY",
    players: [hostPlayer],
    imposterId: "",
    wordPair: defaultWordPair,
    clues: [],
  };

  rooms.set(roomCode, newGame);
  return newGame;
}

export function getRoom(roomCode: string): ActiveGame | undefined {
  return rooms.get(roomCode.toUpperCase());
}

export function addPlayerToRoom(roomCode: string, player: Player): ActiveGame | null {
  const room = getRoom(roomCode);
  if (!room) return null;

  const existingIndex = room.players.findIndex((p) => p.id === player.id);
  if (existingIndex !== -1) {
    room.players[existingIndex] = player;
  } else {
    room.players.push(player);
  }

  return room;
}

export function removePlayerFromRoom(roomCode: string, playerId: string): ActiveGame | null {
  const room = getRoom(roomCode);
  if (!room) return null;

  room.players = room.players.filter((p) => p.id !== playerId);

  if (room.players.length === 0) {
    rooms.delete(room.roomCode);
    return null;
  }

  if (room.hostId === playerId && room.players.length > 0) {
    room.hostId = room.players[0].id;
    room.players[0].isHost = true;
  }

  return room;
}

// Start Game Logic
export function startGame(roomCode: string, requesterId: string): ActiveGame {
  const room = getRoom(roomCode);
  if (!room) {
    throw new Error("Room not found.");
  }

  if (room.hostId !== requesterId) {
    throw new Error("Only the room host can start the game.");
  }

  if (room.gameState !== "LOBBY") {
    throw new Error("Game is already in progress.");
  }

  if (room.players.length < 3) {
    throw new Error("Minimum 3 players required to start.");
  }

  // 1. Pick a random word pair
  room.wordPair = getRandomWordPair();

  // 2. Randomly select the Imposter
  const imposterIndex = Math.floor(Math.random() * room.players.length);
  room.imposterId = room.players[imposterIndex].id;

  // 3. Transition to ROUND_1
  room.gameState = "ROUND_1";
  room.clues = [];

  return room;
}

// Convert internal game data to sanitized public data (stripping secrets)
export function getPublicGameState(room: ActiveGame): PublicGameState {
  let roundNum = 0;
  if (room.gameState === "ROUND_1") roundNum = 1;
  else if (room.gameState === "ROUND_2" || room.gameState === "VOTING_1") roundNum = 2;
  else if (room.gameState === "ROUND_3" || room.gameState === "FINAL_VOTING") roundNum = 3;

  return {
    roomCode: room.roomCode,
    hostId: room.hostId,
    gameState: room.gameState,
    players: room.players,
    currentRound: roundNum,
    category: room.wordPair.category,
    clues: room.clues,
  };
}