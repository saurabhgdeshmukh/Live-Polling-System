import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import questionRoutes from "./routes/questionRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import chatSocketHandler from "./sockets/chatSocket.js";
import { socketHandler } from "./sockets/questionSocket.js";
import { registerParticipantHandlers } from "./sockets/participants.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = ["https://live-polling-system-syn9.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api", chatRoutes);
app.use("/api", questionRoutes);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  registerParticipantHandlers(io, socket);
});
chatSocketHandler(io);
socketHandler(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
