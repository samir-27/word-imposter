// backend/src/index.ts
import http from "http";
import express, { Request, Response } from "express";
import cors from "cors";
import { Server } from "socket.io";
import { config } from "./config/env.js";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./types/socket.js";

const app = express();

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.isProduction ? "production" : "development",
  });
});

// Wrap Express in Node's native HTTP server
const httpServer = http.createServer(app);

// Attach typed Socket.IO server
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: config.clientUrl,
    methods: ["GET", "POST"],
  },
});

// Socket event handling
io.on("connection", (socket) => {
  console.log(`[Socket Connected] ID: ${socket.id}`);

  // Listen for the test ping
  socket.on("ping_server", (data) => {
    console.log(`📩 Received ping from ${socket.id}:`, data.message);

    // Reply directly to this client
    socket.emit("pong_client", {
      message: "Hello from Word Imposter Server!",
      timestamp: Date.now(),
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(`❌ [Socket Disconnected] ID: ${socket.id}, Reason: ${reason}`);
  });
});

// Start listening via httpServer (NOT app.listen)
httpServer.listen(config.port, () => {
  console.log(`🚀 [Server] Running on http://localhost:${config.port}`);
  console.log(`🌐 [Socket.IO] Ready for real-time connections`);
});