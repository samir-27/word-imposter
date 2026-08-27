// frontend/src/screens/LobbyScreen.tsx
import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { PublicGameState } from "../types";

interface LobbyScreenProps {
  room: PublicGameState;
  onLeaveRoom: () => void;
  onStartGame: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ room, onLeaveRoom, onStartGame }) => {
  const [showQr, setShowQr] = useState(false);
  const canStart = room.players.length >= 3;

  // Uses the backend-detected Wi-Fi IP address
  const joinUrl = `${room.networkUrl || window.location.origin}?code=${room.roomCode}`;

  return (
    <div className="space-y-5">
      {/* Room Code Card */}
      <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Room Code</span>
        <div className="text-4xl font-mono font-black text-indigo-400 tracking-wider my-1">
          {room.roomCode}
        </div>
        <button
          onClick={() => setShowQr(!showQr)}
          className="text-xs text-indigo-300 hover:text-indigo-200 font-semibold underline underline-offset-2 mt-1 transition"
        >
          {showQr ? "Hide QR Code" : "📱 Show Phone QR Code"}
        </button>
      </div>

      {/* QR Code Card */}
      {showQr && (
        <div className="p-4 rounded-xl bg-white flex flex-col items-center justify-center space-y-2 text-slate-900 shadow-xl">
          <QRCodeSVG value={joinUrl} size={160} level="M" />
          <p className="text-[11px] font-bold text-slate-600 text-center font-mono">
            {joinUrl}
          </p>
          <p className="text-[10px] text-slate-500 text-center">
            Scan with phone on the same Wi-Fi
          </p>
        </div>
      )}

      {/* Player List */}
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
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    p.isConnected ? "bg-emerald-400" : "bg-rose-500 animate-pulse"
                  }`}
                />
                <span className="font-medium text-sm text-slate-200">{p.name}</span>
              </div>
              {p.isHost && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Host
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex gap-3">
        <button
          onClick={onLeaveRoom}
          className="w-1/3 py-2.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700 transition"
        >
          Leave
        </button>

        <button
          onClick={onStartGame}
          disabled={!canStart}
          className="w-2/3 py-2.5 text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-white rounded-xl shadow-lg transition active:scale-95"
        >
          {canStart ? "Start Game" : "Need 3+ Players"}
        </button>
      </div>
    </div>
  );
};