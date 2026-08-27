// backend/src/index.ts
import http from "http";
import express, { Request, Response } from "express";
import cors from "cors";
import { Server } from "socket.io";
import { config } from "./config/env.js";
import { initializeSockets } from "./sockets/index.js";
import { getLocalIpAddress } from "./utils/lan.js";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./types/socket.js";

const app = express();

// Allow localhost and any local LAN IP origin
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps/curl) or from any local port 5173
      if (!origin || origin.includes(":5173") || origin.includes("localhost")) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local testing
      }
    },
    credentials: true,
  })
);

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
  cors: {
    origin: "*", // Allow all origins on local Wi-Fi
    methods: ["GET", "POST"],
  },
});

initializeSockets(io);

const localIp = getLocalIpAddress();

// Bind to 0.0.0.0 so external devices on Wi-Fi can reach the server
httpServer.listen(config.port, "0.0.0.0", () => {
  console.log(`🚀 [Server] Running locally:  http://localhost:${config.port}`);
  console.log(`📱 [LAN Access] Network URL:  http://${localIp}:${config.port}`);
  console.log(`🌐 [Socket.IO] Listening on all network interfaces`);
});