// frontend/src/components/Header.tsx
import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-6">
      <h1 className="text-3xl font-extrabold text-indigo-400">Word Imposter</h1>
      <p className="text-xs text-slate-400 mt-1">Multiplayer Social Deduction</p>
    </header>
  );
};