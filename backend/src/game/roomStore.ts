// backend/src/game/roomStore.ts
import { ActiveGame, Player, PublicGameState, ClueEntry, VoteTally, SecretRoleData } from "../types/socket.js";
import { getRandomWordPair } from "./wordBank.js";
import { getLocalIpAddress } from "../utils/lan.js";

const rooms = new Map<string, ActiveGame>();
// Track disconnect grace period timers: "roomCode:playerId" -> NodeJS.Timeout
const disconnectTimers = new Map<string, NodeJS.Timeout>();

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
    votes: [],
    gameResult: null,
    currentTurnIndex: 0,
    timerSecondsRemaining: 30,
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

// Disconnect handling with 60-second grace period
export function handlePlayerDisconnect(
  roomCode: string,
  playerId: string,
  onExpire: () => void
): ActiveGame | null {
  const room = getRoom(roomCode);
  if (!room) return null;

  const player = room.players.find((p) => p.id === playerId);
  if (!player) return null;

  player.isConnected = false;

  const timerKey = `${roomCode}:${playerId}`;
  if (disconnectTimers.has(timerKey)) {
    clearTimeout(disconnectTimers.get(timerKey)!);
  }

  // Set 60-second timer to permanently remove player if they don't return
  const timer = setTimeout(() => {
    disconnectTimers.delete(timerKey);
    removePlayerPermanently(roomCode, playerId);
    onExpire();
  }, 60000);

  disconnectTimers.set(timerKey, timer);
  return room;
}

// Reconnect an existing session with new socket ID
export function reconnectPlayer(
  roomCode: string,
  sessionToken: string,
  newSocketId: string
): { room: ActiveGame; player: Player; secret: SecretRoleData | null } | null {
  const room = getRoom(roomCode);
  if (!room) return null;

  const player = room.players.find((p) => p.sessionToken === sessionToken);
  if (!player) return null;

  // Clear grace timer
  const timerKey = `${roomCode}:${player.id}`;
  if (disconnectTimers.has(timerKey)) {
    clearTimeout(disconnectTimers.get(timerKey)!);
    disconnectTimers.delete(timerKey);
  }

  // Update socket and online flag
  player.socketId = newSocketId;
  player.isConnected = true;

  // Re-calculate secret role info if game is active
  let secret: SecretRoleData | null = null;
  if (room.gameState !== "LOBBY") {
    const isImposter = player.id === room.imposterId;
    secret = {
      role: isImposter ? "IMPOSTER" : "INNOCENT",
      word: isImposter ? room.wordPair.imposterWord : room.wordPair.innocentWord,
      category: room.wordPair.category,
    };
  }

  return { room, player, secret };
}

export function removePlayerPermanently(roomCode: string, playerId: string): ActiveGame | null {
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
  if (room.gameState !== "LOBBY" && room.gameState !== "GAME_OVER") {
    throw new Error("Game is already in progress.");
  }
  if (room.players.length < 3) throw new Error("Minimum 3 players required.");

  room.wordPair = getRandomWordPair();
  const imposterIndex = Math.floor(Math.random() * room.players.length);
  room.imposterId = room.players[imposterIndex].id;
  room.gameState = "ROUND_1";
  room.clues = [];
  room.votes = [];
  room.gameResult = null;
  room.currentTurnIndex = 0;
  room.timerSecondsRemaining = 30;

  return room;
}

export function submitClue(roomCode: string, playerId: string, rawClue: string): ActiveGame {
  const room = getRoom(roomCode);
  if (!room) throw new Error("Room not found.");

  const currentTurnPlayer = room.players[room.currentTurnIndex];
  if (!currentTurnPlayer || currentTurnPlayer.id !== playerId) {
    throw new Error("It is not your turn to give a clue.");
  }

  let currentRoundNum: 1 | 2 | 3 | null = null;
  if (room.gameState === "ROUND_1") currentRoundNum = 1;
  else if (room.gameState === "ROUND_2") currentRoundNum = 2;
  else if (room.gameState === "ROUND_3") currentRoundNum = 3;

  if (!currentRoundNum) throw new Error("Clues cannot be submitted during this phase.");

  const cleanClue = rawClue.trim() || "[Timed Out]";

  const newClueEntry: ClueEntry = {
    playerId: currentTurnPlayer.id,
    playerName: currentTurnPlayer.name,
    clue: cleanClue,
    round: currentRoundNum,
  };
  room.clues.push(newClueEntry);

  room.currentTurnIndex += 1;
  room.timerSecondsRemaining = 30;

  if (room.currentTurnIndex >= room.players.length) {
    room.currentTurnIndex = 0;
    if (room.gameState === "ROUND_1") {
      room.gameState = "ROUND_2";
    } else if (room.gameState === "ROUND_2") {
      room.gameState = "VOTING_1";
      room.timerSecondsRemaining = 45;
    } else if (room.gameState === "ROUND_3") {
      room.gameState = "FINAL_VOTING";
      room.timerSecondsRemaining = 45;
    }
  }

  return room;
}

export function castVote(roomCode: string, voterId: string, targetId: string): ActiveGame {
  const room = getRoom(roomCode);
  if (!room) throw new Error("Room not found.");

  if (room.gameState !== "VOTING_1" && room.gameState !== "FINAL_VOTING") {
    throw new Error("Voting is not active.");
  }

  const votingRound = room.gameState === "VOTING_1" ? 1 : 2;

  if (targetId === "ANOTHER_ROUND") {
    if (room.gameState === "FINAL_VOTING") throw new Error("'Another Round' not allowed in final voting.");
  } else {
    if (!room.players.some((p) => p.id === targetId)) throw new Error("Invalid target player.");
  }

  if (room.votes.some((v) => v.voterId === voterId && v.round === votingRound)) {
    throw new Error("You already voted.");
  }

  room.votes.push({ voterId, targetId, round: votingRound });

  const currentVotes = room.votes.filter((v) => v.round === votingRound);
  if (currentVotes.length >= room.players.length) {
    resolveVoting(room, votingRound);
  }

  return room;
}

function resolveVoting(room: ActiveGame, votingRound: 1 | 2): void {
  const currentVotes = room.votes.filter((v) => v.round === votingRound);
  const imposter = room.players.find((p) => p.id === room.imposterId);
  const imposterName = imposter ? imposter.name : "Unknown";

  const counts: Record<string, number> = {};
  for (const v of currentVotes) {
    counts[v.targetId] = (counts[v.targetId] || 0) + 1;
  }

  const voteTallies: VoteTally[] = Object.entries(counts).map(([id, count]) => {
    let name = "Another Round";
    if (id !== "ANOTHER_ROUND") {
      const found = room.players.find((p) => p.id === id);
      if (found) name = found.name;
    }
    return { targetId: id, targetName: name, count };
  }).sort((a, b) => b.count - a.count);

  const highestCount = voteTallies[0]?.count || 0;
  const topCandidates = voteTallies.filter((t) => t.count === highestCount);

  if (votingRound === 1) {
    if (topCandidates.length > 1 || topCandidates[0].targetId === "ANOTHER_ROUND") {
      room.gameState = "ROUND_3";
      room.currentTurnIndex = 0;
      room.timerSecondsRemaining = 30;
      return;
    }

    const winnerTarget = topCandidates[0].targetId;
    const isImposter = winnerTarget === room.imposterId;
    room.gameState = "GAME_OVER";
    room.gameResult = {
      winner: isImposter ? "PLAYERS" : "IMPOSTER",
      reason: isImposter
        ? "Players successfully identified the Imposter!"
        : "An Innocent player was voted out. Imposter wins!",
      imposterId: room.imposterId,
      imposterName,
      innocentWord: room.wordPair.innocentWord,
      imposterWord: room.wordPair.imposterWord,
      voteTallies,
    };
    return;
  }

  if (votingRound === 2) {
    if (topCandidates.length > 1) {
      room.gameState = "GAME_OVER";
      room.gameResult = {
        winner: "IMPOSTER",
        reason: "Final voting ended in a tie. The Imposter escapes!",
        imposterId: room.imposterId,
        imposterName,
        innocentWord: room.wordPair.innocentWord,
        imposterWord: room.wordPair.imposterWord,
        voteTallies,
      };
      return;
    }

    const winnerTarget = topCandidates[0].targetId;
    const isImposter = winnerTarget === room.imposterId;
    room.gameState = "GAME_OVER";
    room.gameResult = {
      winner: isImposter ? "PLAYERS" : "IMPOSTER",
      reason: isImposter
        ? "Players caught the Imposter in the final round!"
        : "The wrong player was voted out. Imposter wins!",
      imposterId: room.imposterId,
      imposterName,
      innocentWord: room.wordPair.innocentWord,
      imposterWord: room.wordPair.imposterWord,
      voteTallies,
    };
  }
}

export function getPublicGameState(room: ActiveGame): PublicGameState {
  let roundNum = 0;
  if (room.gameState === "ROUND_1") roundNum = 1;
  else if (room.gameState === "ROUND_2" || room.gameState === "VOTING_1") roundNum = 2;
  else if (room.gameState === "ROUND_3" || room.gameState === "FINAL_VOTING") roundNum = 3;

  const currentTurnPlayer = ["ROUND_1", "ROUND_2", "ROUND_3"].includes(room.gameState)
    ? room.players[room.currentTurnIndex]?.id || null
    : null;

  const votingRound = room.gameState === "VOTING_1" ? 1 : room.gameState === "FINAL_VOTING" ? 2 : null;
  const votedPlayerIds = votingRound
    ? room.votes.filter((v) => v.round === votingRound).map((v) => v.voterId)
    : [];

  // Construct the LAN URL that external mobile devices should navigate to
  const localIp = getLocalIpAddress();
  const networkUrl = `http://${localIp}:5173`;

  return {
    roomCode: room.roomCode,
    hostId: room.hostId,
    gameState: room.gameState,
    players: room.players,
    currentRound: roundNum,
    category: room.wordPair.category,
    clues: room.clues,
    currentTurnPlayerId: currentTurnPlayer,
    timerSecondsRemaining: room.timerSecondsRemaining,
    votedPlayerIds,
    gameResult: room.gameResult,
    networkUrl,
  };
}