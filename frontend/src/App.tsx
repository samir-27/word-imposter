// frontend/src/App.tsx
import "./App.css";
import { useState, useEffect } from "react";
import { socket } from "./socket";
import type { PublicGameState, SecretRoleData } from "./types";
import { Card } from "./components/Card";
import { Header } from "./components/Header";
import { ErrorBanner } from "./components/ErrorBanner";
import { HomeScreen } from "./screens/HomeScreen";
import { LobbyScreen } from "./screens/LobbyScreen";
import { GameScreen } from "./screens/GameScreen";
import { VotingScreen } from "./screens/VotingScreen";
import { GameOverScreen } from "./screens/GameOverScreen";

export default function App() {
  const [currentRoom, setCurrentRoom] = useState<PublicGameState | null>(null);
  const [secretRole, setSecretRole] = useState<SecretRoleData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onRoomUpdated(data: PublicGameState) {
      setCurrentRoom(data);
      setError(null);
    }

    function onSecretRole(data: SecretRoleData) {
      setSecretRole(data);
    }

    socket.on("room_updated", onRoomUpdated);
    socket.on("secret_role", onSecretRole);

    return () => {
      socket.off("room_updated", onRoomUpdated);
      socket.off("secret_role", onSecretRole);
    };
  }, []);

  const handleCreateRoom = (playerName: string) => {
    if (!playerName.trim()) return setError("Please enter your name.");
    setError(null);
    socket.emit("create_room", { playerName }, (res) => {
      if (!res.success && res.error) setError(res.error);
    });
  };

  const handleJoinRoom = (roomCode: string, playerName: string) => {
    if (!playerName.trim()) return setError("Please enter your name.");
    if (!roomCode.trim()) return setError("Please enter a room code.");
    setError(null);
    socket.emit("join_room", { roomCode, playerName }, (res) => {
      if (!res.success && res.error) setError(res.error);
    });
  };

  const handleLeaveRoom = () => {
    socket.emit("leave_room");
    setCurrentRoom(null);
    setSecretRole(null);
    setError(null);
  };

  const handleStartGame = () => {
    setError(null);
    socket.emit("start_game", (res) => {
      if (!res.success && res.error) setError(res.error);
    });
  };

  const handleSubmitClue = (clue: string) => {
    setError(null);
    socket.emit("submit_clue", { clue }, (res) => {
      if (!res.success && res.error) setError(res.error);
    });
  };

  const handleCastVote = (targetId: string) => {
    setError(null);
    socket.emit("cast_vote", { targetId }, (res) => {
      if (!res.success && res.error) setError(res.error);
    });
  };

  const handleRestartGame = () => {
    setError(null);
    socket.emit("restart_game", (res) => {
      if (!res.success && res.error) setError(res.error);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950 text-slate-100">
      <Card>
        <Header />
        <ErrorBanner message={error} />

        {!currentRoom && (
          <HomeScreen onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
        )}

        {currentRoom && currentRoom.gameState === "LOBBY" && (
          <LobbyScreen
            room={currentRoom}
            onLeaveRoom={handleLeaveRoom}
            onStartGame={handleStartGame}
          />
        )}

        {currentRoom && ["ROUND_1", "ROUND_2", "ROUND_3"].includes(currentRoom.gameState) && (
          <GameScreen
            room={currentRoom}
            secret={secretRole}
            onSubmitClue={handleSubmitClue}
          />
        )}

        {currentRoom && ["VOTING_1", "FINAL_VOTING"].includes(currentRoom.gameState) && (
          <VotingScreen
            room={currentRoom}
            onCastVote={handleCastVote}
          />
        )}

        {currentRoom && currentRoom.gameState === "GAME_OVER" && (
          <GameOverScreen
            room={currentRoom}
            onRestartGame={handleRestartGame}
            onLeaveRoom={handleLeaveRoom}
          />
        )}
      </Card>
    </main>
  );
}