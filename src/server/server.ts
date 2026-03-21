import express from "express"
import * as http from "http"
import { Server } from "socket.io"

let io: Server;

export async function createSocketServer() {
  const app = express();

  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    console.log("Imperial dashboard connected");

    socket.on("disconnect", () => {
      console.log("Dashboard disconnected");
    });
  });

  // Listen on port 3000
  server.listen(3000, () => {
    console.log("🏛️  Socket.io Server running on port 3000");
  });

  return server;
}

export function getIoInstance() {
  return io;
}

