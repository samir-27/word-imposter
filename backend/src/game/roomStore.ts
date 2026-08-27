// backend/src/game/roomStore.ts
import { ActiveGame, Player, PublicGameState, ClueEntry, VoteEntry, VoteTally, GameResult } from "../types/socket.js";
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
    votes: [],
    gameResult: null,
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

  return room;
}

export function submitClue(roomCode: string, playerId: string, rawClue: string): ActiveGame {
  const room = getRoom(roomCode);
  if (!room) throw new Error("Room not found.");

  const player = room.players.find((p) => p.id === playerId);
  if (!player) throw new Error("Player not in room.");

  const cleanClue = rawClue.trim();
  if (!cleanClue) throw new Error("Clue cannot be empty.");
  if (cleanClue.length > 50) throw new Error("Clue must be 50 characters or less.");

  let currentRoundNum: 1 | 2 | 3 | null = null;
  if (room.gameState === "ROUND_1") currentRoundNum = 1;
  else if (room.gameState === "ROUND_2") currentRoundNum = 2;
  else if (room.gameState === "ROUND_3") currentRoundNum = 3;

  if (currentRoundNum === null) {
    throw new Error("Clues cannot be submitted during this phase.");
  }

  const alreadySubmitted = room.clues.some(
    (c) => c.playerId === playerId && c.round === currentRoundNum
  );
  if (alreadySubmitted) {
    throw new Error("You have already submitted a clue for this round.");
  }

  const newClueEntry: ClueEntry = {
    playerId: player.id,
    playerName: player.name,
    clue: cleanClue,
    round: currentRoundNum,
  };
  room.clues.push(newClueEntry);

  const roundCluesCount = room.clues.filter((c) => c.round === currentRoundNum).length;

  if (roundCluesCount >= room.players.length) {
    if (room.gameState === "ROUND_1") {
      room.gameState = "ROUND_2";
    } else if (room.gameState === "ROUND_2") {
      room.gameState = "VOTING_1";
    } else if (room.gameState === "ROUND_3") {
      room.gameState = "FINAL_VOTING";
    }
  }

  return room;
}

// Voting Logic & Resolution
export function castVote(roomCode: string, voterId: string, targetId: string): ActiveGame {
  const room = getRoom(roomCode);
  if (!room) throw new Error("Room not found.");

  if (room.gameState !== "VOTING_1" && room.gameState !== "FINAL_VOTING") {
    throw new Error("Voting is not currently active.");
  }

  const voter = room.players.find((p) => p.id === voterId);
  if (!voter) throw new Error("Voter not in room.");

  const votingRound = room.gameState === "VOTING_1" ? 1 : 2;

  // Validate target selection
  if (targetId === "ANOTHER_ROUND") {
    if (room.gameState === "FINAL_VOTING") {
      throw new Error("'Another Round' is not allowed in final voting.");
    }
  } else {
    const targetPlayerExists = room.players.some((p) => p.id === targetId);
    if (!targetPlayerExists) {
      throw new Error("Invalid player selected for vote.");
    }
  }

  // Prevent duplicate voting in this phase
  const alreadyVoted = room.votes.some(
    (v) => v.voterId === voterId && v.round === votingRound
  );
  if (alreadyVoted) {
    throw new Error("You have already voted in this round.");
  }

  room.votes.push({
    voterId,
    targetId,
    round: votingRound,
  });

  const currentPhaseVotes = room.votes.filter((v) => v.round === votingRound);

  // If all players have voted, resolve the phase
  if (currentPhaseVotes.length >= room.players.length) {
    resolveVoting(room, votingRound);
  }

  return room;
}

function resolveVoting(room: ActiveGame, votingRound: 1 | 2): void {
  const currentVotes = room.votes.filter((v) => v.round === votingRound);
  const imposter = room.players.find((p) => p.id === room.imposterId);
  const imposterName = imposter ? imposter.name : "Unknown";

  // Count tallies
  const counts: Record<string, number> = {};
  for (const v of currentVotes) {
    counts[v.targetId] = (counts[v.targetId] || 0) + 1;
  }

  // Format vote tallies for presentation
  const voteTallies: VoteTally[] = Object.entries(counts).map(([id, count]) => {
    let name = "Another Round";
    if (id !== "ANOTHER_ROUND") {
      const found = room.players.find((p) => p.id === id);
      if (found) name = found.name;
    }
    return { targetId: id, targetName: name, count };
  }).sort((a, b) => b.count - a.count);

  const highestCount = voteTallies[0].count;
  const topCandidates = voteTallies.filter((t) => t.count === highestCount);

  // --- RESOLUTION FOR VOTING 1 (After Round 2) ---
  if (votingRound === 1) {
    // TIE RULE: If tie for highest vote count -> Round 3 automatically starts
    if (topCandidates.length > 1) {
      room.gameState = "ROUND_3";
      return;
    }

    const winnerTarget = topCandidates[0].targetId;

    // ANOTHER ROUND RULE: If "ANOTHER_ROUND" gets highest votes -> Round 3 starts
    if (winnerTarget === "ANOTHER_ROUND") {
      room.gameState = "ROUND_3";
      return;
    }

    // SINGLE PLAYER ACCUSED: Reveal role
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

  // --- RESOLUTION FOR FINAL VOTING (After Round 3) ---
  if (votingRound === 2) {
    // FINAL TIE RULE: If tie in final voting -> IMPOSTER WINS
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
        : "The wrong player was voted out in the final round. Imposter wins!",
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

  const submittedPlayerIds = room.clues
    .filter((c) => c.round === roundNum)
    .map((c) => c.playerId);

  const votingRound = room.gameState === "VOTING_1" ? 1 : room.gameState === "FINAL_VOTING" ? 2 : null;
  const votedPlayerIds = votingRound
    ? room.votes.filter((v) => v.round === votingRound).map((v) => v.voterId)
    : [];

  return {
    roomCode: room.roomCode,
    hostId: room.hostId,
    gameState: room.gameState,
    players: room.players,
    currentRound: roundNum,
    category: room.wordPair.category,
    clues: room.clues,
    submittedPlayerIds,
    votedPlayerIds,
    gameResult: room.gameResult,
  };
}