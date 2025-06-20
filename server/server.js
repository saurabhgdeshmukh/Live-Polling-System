import express from "express";
import http from "http";
import { Server } from "socket.io";
import questionRoutes from "./routes/questionRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import chatRoutes from "./routes/chatRoutes.js";
import chatSocketHandler from "./sockets/chatSocket.js";
import { socketHandler } from "./sockets/questionSocket.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  },
});
app.set("io", io);
app.use(cors());
app.use(express.json());
app.use("/api", chatRoutes);
app.use("/api", questionRoutes);

chatSocketHandler(io);
socketHandler(io);
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));