// backend/src/game/roomStore.ts
import { RoomData, Player } from "../types/socket.js";

// Map: roomCode -> RoomData
const rooms = new Map<string, RoomData>();

// Helper to generate a 5-character alphanumeric room code (e.g. X7K2P)
export function generateRoomCode(): string {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing letters like O, 0, 1, I
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  // Ensure uniqueness
  return rooms.has(code) ? generateRoomCode() : code;
}

export function createRoom(hostPlayer: Player): RoomData {
  const roomCode = generateRoomCode();
  const newRoom: RoomData = {
    roomCode,
    hostId: hostPlayer.id,
    gameState: "LOBBY",
    players: [hostPlayer],
  };

  rooms.set(roomCode, newRoom);
  return newRoom;
}

export function getRoom(roomCode: string): RoomData | undefined {
  return rooms.get(roomCode.toUpperCase());
}

export function addPlayerToRoom(roomCode: string, player: Player): RoomData | null {
  const room = getRoom(roomCode);
  if (!room) return null;

  // Check if player already exists in the room (e.g. same name)
  const existingPlayerIndex = room.players.findIndex((p) => p.id === player.id);
  if (existingPlayerIndex !== -1) {
    room.players[existingPlayerIndex] = player;
  } else {
    room.players.push(player);
  }

  return room;
}

export function removePlayerFromRoom(roomCode: string, playerId: string): RoomData | null {
  const room = getRoom(roomCode);
  if (!room) return null;

  room.players = room.players.filter((p) => p.id !== playerId);

  // If no players left, delete the room
  if (room.players.length === 0) {
    rooms.delete(room.roomCode);
    return null;
  }

  // If the host left, assign the next player as host
  if (room.hostId === playerId && room.players.length > 0) {
    room.hostId = room.players[0].id;
    room.players[0].isHost = true;
  }

  return room;
}