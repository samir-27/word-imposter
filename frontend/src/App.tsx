// frontend/src/App.tsx
import "./App.css";
import { useState, useEffect } from "react";
import { socket } from "./socket";
import type{ RoomData } from "./types";
import { Card } from "./components/Card";
import { Header } from "./components/Header";
import { ErrorBanner } from "./components/ErrorBanner";
import { HomeScreen } from "./screens/HomeScreen";
import { LobbyScreen } from "./screens/LobbyScreen";

export default function App() {
  const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onRoomUpdated(data: RoomData) {
      setCurrentRoom(data);
      setError(null);
    }

    socket.on("room_updated", onRoomUpdated);

    return () => {
      socket.off("room_updated", onRoomUpdated);
    };
  }, []);

  const handleCreateRoom = (playerName: string) => {
    if (!playerName.trim()) {
      setError("Please enter your name.");
      return;
    }
    setError(null);
    socket.emit("create_room", { playerName }, (res) => {
      if (!res.success && res.error) {
        setError(res.error);
      }
    });
  };

  const handleJoinRoom = (roomCode: string, playerName: string) => {
    if (!playerName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!roomCode.trim()) {
      setError("Please enter a 5-letter room code.");
      return;
    }
    setError(null);
    socket.emit("join_room", { roomCode, playerName }, (res) => {
      if (!res.success && res.error) {
        setError(res.error);
      }
    });
  };

  const handleLeaveRoom = () => {
    socket.emit("leave_room");
    setCurrentRoom(null);
    setError(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950 text-slate-100">
      <Card>
        <Header />
        <ErrorBanner message={error} />

        {!currentRoom ? (
          <HomeScreen
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
          />
        ) : (
          <LobbyScreen
            room={currentRoom}
            onLeaveRoom={handleLeaveRoom}
          />
        )}
      </Card>
    </main>
  );
}