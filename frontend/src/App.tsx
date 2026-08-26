import { useState } from 'react';
import "./App.css"
// A simple interface demonstrating TypeScript typing for component state
interface GameInfo {
  title: string;
  status: "Lobby" | "Playing" | "Ended";
}

export default function App() {
  const [game] = useState<GameInfo>({
    title: "Word Imposter",
    status: "Lobby",
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-8 shadow-xl border border-slate-700 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-indigo-400 mb-2">
          {game.title}
        </h1>
        <p className="text-slate-400 mb-6">
          Real-time multiplayer deduction game
        </p>

        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-1.5 text-sm font-medium text-slate-300 border border-slate-700">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Status: {game.status}
        </div>
      </div>
    </main>
  );
}