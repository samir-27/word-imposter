// backend/src/index.ts
import http from "http";
import express, { Request, Response } from "express";
import cors from "cors";
import { Server } from "socket.io";
import { config } from "./config/env.js";
import { initializeSockets } from "./sockets/index.js";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./types/socket.js";

const app = express();
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

const httpServer = http.createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: { origin: config.clientUrl, methods: ["GET", "POST"] },
});

// Initialize all socket event handlers
initializeSockets(io);

httpServer.listen(config.port, () => {
  console.log(`🚀 [Server] Running on http://localhost:${config.port}`);
});