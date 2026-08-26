import { useEffect, useState } from 'react';
import "./App.css"
import { socket } from "./socket";

export default function App() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [socketId, setSocketId] = useState<string>("");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setSocketId(socket.id || "");
    }

    function onDisconnect() {
      setIsConnected(false);
      setSocketId("");
    }

    function onPong(data: { message: string; timestamp: number }) {
      setServerMessage(`${data.message} (Received at: ${new Date(data.timestamp).toLocaleTimeString()})`);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("pong_client", onPong);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("pong_client", onPong);
    };
  }, []);

  const handlePing = () => {
    socket.emit("ping_server", { message: "Ping from client!" });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-8 shadow-xl border border-slate-700 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-indigo-400 mb-2">
          Word Imposter
        </h1>
        <p className="text-slate-400 mb-6 text-sm">
          Real-Time Socket Connection Test
        </p>

        {/* Connection Status Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-1.5 text-sm font-medium border border-slate-700">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
            }`}
          />
          <span className={isConnected ? "text-emerald-300" : "text-rose-300"}>
            {isConnected ? "Connected to Server" : "Disconnected"}
          </span>
        </div>

        {isConnected && (
          <p className="text-xs text-slate-500 mb-6 font-mono break-all">
            Socket ID: {socketId}
          </p>
        )}

        {/* Action Button */}
        <button
          onClick={handlePing}
          disabled={!isConnected}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Send Real-Time Ping
        </button>

        {/* Server Response Box */}
        {serverMessage && (
          <div className="mt-4 rounded-lg bg-slate-900 p-3 text-xs text-indigo-300 border border-slate-700 text-left">
            <span className="font-bold">Server Response:</span> {serverMessage}
          </div>
        )}
      </div>
    </main>
  );
}