// frontend/src/screens/GameScreen.tsx
import React from "react";
import type { PublicGameState, SecretRoleData } from "../types";

interface GameScreenProps {
  room: PublicGameState;
  secret: SecretRoleData | null;
}

export const GameScreen: React.FC<GameScreenProps> = ({ room, secret }) => {
  return (
    <div className="space-y-6">
      {/* Round & Category Badge */}
      <div className="flex justify-between items-center bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-700">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Phase</span>
          <div className="text-lg font-black text-indigo-400">Round {room.currentRound} of 3</div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category</span>
          <div className="text-sm font-semibold text-slate-200">{room.category}</div>
        </div>
      </div>

      {/* Secret Word Card */}
      {secret ? (
        <div
          className={`p-5 rounded-xl border text-center transition ${
            secret.role === "IMPOSTER"
              ? "bg-rose-950/40 border-rose-600/50"
              : "bg-indigo-950/40 border-indigo-600/50"
          }`}
        >
          <span
            className={`text-xs uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-2 ${
              secret.role === "IMPOSTER"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
            }`}
          >
            {secret.role === "IMPOSTER" ? "You are the Imposter" : "You are Innocent"}
          </span>

          <div className="text-xs text-slate-400 mt-1">Your Secret Word</div>
          <div className="text-3xl font-black text-white tracking-wide mt-1">{secret.word}</div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-800 text-center text-slate-400 animate-pulse">
          Receiving secret role...
        </div>
      )}

      {/* Active Player List */}
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Players in Game ({room.players.length})
        </span>
        <div className="grid grid-cols-2 gap-2">
          {room.players.map((p) => (
            <div
              key={p.id}
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700/60 text-sm font-medium text-slate-300 truncate"
            >
              {p.name} {p.isHost && "👑"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};