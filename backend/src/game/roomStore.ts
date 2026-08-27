// backend/src/game/roomStore.ts
import { ActiveGame, Player, PublicGameState, ClueEntry } from "../types/socket.js";
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

export function startGame(roomCode: string, requesterId: string): ActiveGame {
  const room = getRoom(roomCode);
  if (!room) throw new Error("Room not found.");
  if (room.hostId !== requesterId) throw new Error("Only the host can start the game.");
  if (room.gameState !== "LOBBY") throw new Error("Game is already in progress.");
  if (room.players.length < 3) throw new Error("Minimum 3 players required.");

  room.wordPair = getRandomWordPair();
  const imposterIndex = Math.floor(Math.random() * room.players.length);
  room.imposterId = room.players[imposterIndex].id;
  room.gameState = "ROUND_1";
  room.clues = [];

  return room;
}

// Clue Submission & Round Transition Handler
export function submitClue(roomCode: string, playerId: string, rawClue: string): ActiveGame {
  const room = getRoom(roomCode);
  if (!room) throw new Error("Room not found.");

  const player = room.players.find((p) => p.id === playerId);
  if (!player) throw new Error("Player not in room.");

  const cleanClue = rawClue.trim();
  if (!cleanClue) throw new Error("Clue cannot be empty.");
  if (cleanClue.length > 50) throw new Error("Clue must be 50 characters or less.");

  // Determine current round number
  let currentRoundNum: 1 | 2 | 3 | null = null;
  if (room.gameState === "ROUND_1") currentRoundNum = 1;
  else if (room.gameState === "ROUND_2") currentRoundNum = 2;
  else if (room.gameState === "ROUND_3") currentRoundNum = 3;

  if (currentRoundNum === null) {
    throw new Error("Clues cannot be submitted during this phase.");
  }

  // Check if player has already submitted for this specific round
  const alreadySubmitted = room.clues.some(
    (c) => c.playerId === playerId && c.round === currentRoundNum
  );
  if (alreadySubmitted) {
    throw new Error("You have already submitted a clue for this round.");
  }

  // Record the clue
  const newClueEntry: ClueEntry = {
    playerId: player.id,
    playerName: player.name,
    clue: cleanClue,
    round: currentRoundNum,
  };
  room.clues.push(newClueEntry);

  // Check how many players have submitted for the current round
  const roundCluesCount = room.clues.filter((c) => c.round === currentRoundNum).length;

  // If all players have submitted, transition the state
  if (roundCluesCount >= room.players.length) {
    if (room.gameState === "ROUND_1") {
      room.gameState = "ROUND_2"; // Round 1 -> Round 2 (No voting)
    } else if (room.gameState === "ROUND_2") {
      room.gameState = "VOTING_1"; // Round 2 -> First Voting
    } else if (room.gameState === "ROUND_3") {
      room.gameState = "FINAL_VOTING"; // Round 3 -> Final Voting
    }
  }

  return room;
}

export function getPublicGameState(room: ActiveGame): PublicGameState {
  let roundNum = 0;
  if (room.gameState === "ROUND_1") roundNum = 1;
  else if (room.gameState === "ROUND_2" || room.gameState === "VOTING_1") roundNum = 2;
  else if (room.gameState === "ROUND_3" || room.gameState === "FINAL_VOTING") roundNum = 3;

  // Calculate which players have submitted for the current round
  const submittedPlayerIds = room.clues
    .filter((c) => c.round === roundNum)
    .map((c) => c.playerId);

  return {
    roomCode: room.roomCode,
    hostId: room.hostId,
    gameState: room.gameState,
    players: room.players,
    currentRound: roundNum,
    category: room.wordPair.category,
    clues: room.clues,
    submittedPlayerIds,
  };
}