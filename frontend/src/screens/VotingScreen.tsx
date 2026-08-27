// frontend/src/screens/VotingScreen.tsx
import React, { useState } from "react";
import type { PublicGameState } from "../types";

interface VotingScreenProps {
  room: PublicGameState;
  onCastVote: (targetId: string) => void;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({ room, onCastVote }) => {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const isFinalVoting = room.gameState === "FINAL_VOTING";

  return (
    <div className="space-y-5">
      <div className="text-center">
        <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block mb-2">
          {isFinalVoting ? "Final Voting Phase" : "First Voting Phase"}
        </span>
        <h2 className="text-xl font-black text-white">Who is the Imposter?</h2>
        <p className="text-xs text-slate-400 mt-1">
          {isFinalVoting
            ? "Must vote for a player. A tie means Imposter wins!"
            : "Select a player or vote for Another Round."}
        </p>
      </div>

      {/* Target Options */}
      <div className="space-y-2">
        {room.players.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedTarget(p.id)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition active:scale-[0.99] ${
              selectedTarget === p.id
                ? "bg-indigo-600/30 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                : "bg-slate-800 border-slate-700/80 text-slate-300 hover:bg-slate-700/60"
            }`}
          >
            <span>{p.name}</span>
            <span className="text-xs text-slate-400 font-mono">
              {room.clues.filter((c) => c.playerId === p.id).map((c) => `"${c.clue}"`).join(" • ")}
            </span>
          </button>
        ))}

        {!isFinalVoting && (
          <button
            onClick={() => setSelectedTarget("ANOTHER_ROUND")}
            className={`w-full p-3 rounded-xl border text-sm font-semibold transition active:scale-[0.99] ${
              selectedTarget === "ANOTHER_ROUND"
                ? "bg-emerald-600/30 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "bg-slate-800/80 border-slate-700 text-emerald-400 hover:bg-slate-700/60"
            }`}
          >
            🔄 Another Round (Round 3)
          </button>
        )}
      </div>

      {/* Submit Vote Button */}
      <button
        disabled={!selectedTarget}
        onClick={() => selectedTarget && onCastVote(selectedTarget)}
        className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-white rounded-xl shadow-lg transition"
      >
        Lock In Vote ({room.votedPlayerIds.length} / {room.players.length} Voted)
      </button>
    </div>
  );
};