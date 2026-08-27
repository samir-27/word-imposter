// frontend/src/screens/GameScreen.tsx
import React, { useState, useEffect } from "react";
import type { PublicGameState, SecretRoleData } from "../types";
import { socket } from "../socket";

interface GameScreenProps {
  room: PublicGameState;
  secret: SecretRoleData | null;
  onSubmitClue: (clue: string) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ room, secret, onSubmitClue }) => {
  const [clueInput, setClueInput] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(room.timerSecondsRemaining);

  useEffect(() => {
    setSecondsLeft(room.timerSecondsRemaining);
  }, [room.timerSecondsRemaining, room.currentTurnPlayerId]);

  useEffect(() => {
    const handleTick = (data: { secondsRemaining: number }) => {
      setSecondsLeft(data.secondsRemaining);
    };
    socket.on("timer_tick", handleTick);
    return () => {
      socket.off("timer_tick", handleTick);
    };
  }, []);

  const currentTurnPlayer = room.players.find((p) => p.id === room.currentTurnPlayerId);
  const isMyTurn = currentTurnPlayer?.socketId === socket.id;
  const isCluePhase = ["ROUND_1", "ROUND_2", "ROUND_3"].includes(room.gameState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clueInput.trim()) return;
    onSubmitClue(clueInput);
    setClueInput("");
  };

  const timerPercentage = Math.max(0, Math.min(100, (secondsLeft / 30) * 100));

  return (
    <div className="space-y-4">
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

      {/* Synchronized Countdown Timer Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            secondsLeft <= 5 ? "bg-rose-500 animate-pulse" : "bg-indigo-500"
          }`}
          style={{ width: `${timerPercentage}%` }}
        />
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

      {/* Turn Indicator Banner */}
      {isCluePhase && (
        <div
          className={`p-3 rounded-xl border text-center text-sm font-bold ${
            isMyTurn
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 animate-pulse"
              : "bg-slate-800/80 border-slate-700 text-slate-300"
          }`}
        >
          {isMyTurn
            ? `👉 YOUR TURN TO GIVE A CLUE (${secondsLeft}s)`
            : `⏳ Waiting for ${currentTurnPlayer?.name || "next player"} (${secondsLeft}s)`}
        </div>
      )}

      {/* Clue Input Form */}
      {isCluePhase && isMyTurn && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            maxLength={40}
            autoFocus
            placeholder="Type your clue..."
            value={clueInput}
            onChange={(e) => setClueInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!clueInput.trim()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 font-bold text-sm text-white rounded-lg shadow transition active:scale-95"
          >
            Submit
          </button>
        </form>
      )}

      {/* Live Clue Feed */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Clues Feed
        </span>
        {room.clues.length === 0 ? (
          <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-center text-xs text-slate-500">
            First player is preparing a clue...
          </div>
        ) : (
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {room.clues.map((c, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-sm"
              >
                <div>
                  <span className="font-semibold text-slate-200">{c.playerName}</span>
                  <span className="text-[10px] text-indigo-400 ml-2 font-mono">R{c.round}</span>
                </div>
                <div className="font-bold text-white bg-slate-700/60 px-2.5 py-0.5 rounded border border-slate-600/50">
                  "{c.clue}"
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};