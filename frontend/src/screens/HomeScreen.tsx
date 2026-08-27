// frontend/src/screens/HomeScreen.tsx
import React, { useState } from "react";

interface HomeScreenProps {
  onCreateRoom: (playerName: string) => void;
  onJoinRoom: (roomCode: string, playerName: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateRoom, onJoinRoom }) => {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Your Display Name
        </label>
        <input
          type="text"
          maxLength={15}
          placeholder="e.g. Sam"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        onClick={() => onCreateRoom(playerName)}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-lg shadow-lg transition active:scale-[0.98]"
      >
        Create New Room
      </button>

      <div className="flex items-center gap-2 my-4">
        <div className="h-px bg-slate-800 flex-1" />
        <span className="text-xs text-slate-500 font-medium uppercase">Or Join Existing</span>
        <div className="h-px bg-slate-800 flex-1" />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          maxLength={5}
          placeholder="CODE"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          className="w-1/2 px-4 py-2.5 text-center tracking-widest font-mono uppercase rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => onJoinRoom(roomCode, playerName)}
          className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold rounded-lg transition active:scale-[0.98]"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};