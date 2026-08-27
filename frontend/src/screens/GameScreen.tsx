// frontend/src/screens/GameScreen.tsx
import React, { useState } from "react";
import type { PublicGameState, SecretRoleData } from "../types";

interface GameScreenProps {
  room: PublicGameState;
  secret: SecretRoleData | null;
  onSubmitClue: (clue: string) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ room, secret, onSubmitClue }) => {
  const [clueInput, setClueInput] = useState("");

  // Determine current player's identity via socket id
  const myPlayer = room.players.find((p) => p.socketId === room.players.find(x => x.name)?.socketId);
  // Check if this client already submitted for the current round
  const hasSubmitted = room.submittedPlayerIds.length > 0 && 
    room.players.some((p) => room.submittedPlayerIds.includes(p.id) && p.socketId === p.socketId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clueInput.trim()) return;
    onSubmitClue(clueInput);
    setClueInput("");
  };

  const isCluePhase = ["ROUND_1", "ROUND_2", "ROUND_3"].includes(room.gameState);

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="flex justify-between items-center bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-700">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phase</span>
          <div className="text-base font-black text-indigo-400">
            {isCluePhase ? `Round ${room.currentRound} of 3` : room.gameState.replace("_", " ")}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category</span>
          <div className="text-sm font-semibold text-slate-200">{room.category}</div>
        </div>
      </div>

      {/* Secret Word Card */}
      {secret && (
        <div
          className={`p-4 rounded-xl border text-center transition ${
            secret.role === "IMPOSTER"
              ? "bg-rose-950/40 border-rose-600/50"
              : "bg-indigo-950/40 border-indigo-600/50"
          }`}
        >
          <span
            className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-1 ${
              secret.role === "IMPOSTER"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
            }`}
          >
            {secret.role === "IMPOSTER" ? "You are the Imposter" : "You are Innocent"}
          </span>
          <div className="text-2xl font-black text-white">{secret.word}</div>
        </div>
      )}

      {/* Clue Submission Form */}
      {isCluePhase && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={40}
              placeholder="Give a one-word or short clue..."
              value={clueInput}
              onChange={(e) => setClueInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!clueInput.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-semibold text-sm rounded-lg shadow transition active:scale-95"
            >
              Submit
            </button>
          </div>
          <div className="text-[11px] text-slate-400 text-right">
            Submitted: {room.submittedPlayerIds.length} / {room.players.length} players
          </div>
        </form>
      )}

      {/* Clues History Feed */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Clues Feed
        </span>

        {room.clues.length === 0 ? (
          <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800 text-center text-xs text-slate-500">
            Waiting for clues to be submitted...
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {room.clues.map((c, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-sm"
              >
                <div>
                  <span className="font-semibold text-slate-200">{c.playerName}</span>
                  <span className="text-[10px] text-indigo-400 ml-2 font-mono">R{c.round}</span>
                </div>
                <div className="font-bold text-white bg-slate-700/60 px-2.5 py-1 rounded border border-slate-600/50">
                  "{c.clue}"
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Temporary Placeholder when entering Voting Phase */}
      {!isCluePhase && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-center font-bold text-sm animate-pulse">
          Transitioning to {room.gameState.replace("_", " ")} Phase!
        </div>
      )}
    </div>
  );
};