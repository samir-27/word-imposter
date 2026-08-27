// frontend/src/screens/GameOverScreen.tsx
import React from "react";
import type { PublicGameState } from "../types";

interface GameOverScreenProps {
  room: PublicGameState;
  onRestartGame: () => void;
  onLeaveRoom: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ room, onRestartGame, onLeaveRoom }) => {
  const result = room.gameResult;
  if (!result) return null;

  const isPlayerWin = result.winner === "PLAYERS";

  return (
    <div className="space-y-6 text-center">
      {/* Result Hero */}
      <div
        className={`p-6 rounded-2xl border ${
          isPlayerWin
            ? "bg-emerald-950/40 border-emerald-500/50"
            : "bg-rose-950/40 border-rose-500/50"
        }`}
      >
        <span
          className={`text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded-full inline-block mb-3 ${
            isPlayerWin
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
          }`}
        >
          {isPlayerWin ? "🎉 PLAYERS WIN!" : "😈 IMPOSTER WINS!"}
        </span>

        <h2 className="text-2xl font-black text-white">{result.reason}</h2>

        <div className="mt-4 pt-4 border-t border-slate-700/60 flex justify-around text-left">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Imposter</span>
            <span className="text-sm font-black text-rose-400">{result.imposterName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Innocent Word</span>
            <span className="text-sm font-black text-indigo-300">{result.innocentWord}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Imposter Word</span>
            <span className="text-sm font-black text-rose-300">{result.imposterWord}</span>
          </div>
        </div>
      </div>

      {/* Vote Breakdown */}
      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 text-left">
          Final Vote Tally
        </span>
        <div className="space-y-1.5">
          {result.voteTallies.map((t, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-2.5 rounded-lg bg-slate-800 border border-slate-700/60 text-sm"
            >
              <span className="font-semibold text-slate-200">{t.targetName}</span>
              <span className="font-mono font-bold bg-slate-700/80 px-2 py-0.5 rounded text-white text-xs">
                {t.count} {t.count === 1 ? "vote" : "votes"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onLeaveRoom}
          className="w-1/3 py-2.5 text-sm bg-slate-800 hover:bg-slate-700 font-semibold rounded-xl border border-slate-700 transition"
        >
          Leave
        </button>
        <button
          onClick={onRestartGame}
          className="w-2/3 py-2.5 text-sm bg-indigo-600 hover:bg-indigo-500 font-bold text-white rounded-xl shadow-lg transition active:scale-95"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};