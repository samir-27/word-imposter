// frontend/src/screens/LobbyScreen.tsx
import React from "react";
import type { PublicGameState } from "../types";

interface LobbyScreenProps {
  room: PublicGameState;
  onLeaveRoom: () => void;
  onStartGame: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ room, onLeaveRoom, onStartGame }) => {
  const canStart = room.players.length >= 3;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
        <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Room Code</span>
        <div className="text-3xl font-mono font-black text-indigo-400 tracking-wider mt-1">
          {room.roomCode}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Players ({room.players.length})
          </span>
          <span className="text-xs text-emerald-400 font-medium">In Lobby</span>
        </div>

        <div className="space-y-2">
          {room.players.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 border border-slate-700/60"
            >
              <span className="font-medium">{p.name}</span>
              {p.isHost && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Host
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 flex gap-3">
        <button
          onClick={onLeaveRoom}
          className="w-1/3 py-2.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg border border-slate-700 transition"
        >
          Leave
        </button>

        <button
          onClick={onStartGame}
          disabled={!canStart}
          className="w-2/3 py-2.5 text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold rounded-lg shadow-lg transition"
        >
          {canStart ? "Start Game" : "Need 3+ Players"}
        </button>
      </div>
    </div>
  );
};