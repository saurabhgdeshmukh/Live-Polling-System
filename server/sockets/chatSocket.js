
import  saveMessage  from "../models/chatModel.js";

const chatSocketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    socket.on("chat:send_message", async ({ sender, message }) => {
      try {
        await saveMessage(sender, message);
      } catch (err) {
        console.error("DB Insert Error:", err);
      }

      io.emit("chat:receive_message", { sender, message, sent_at: new Date().toISOString() });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
    });
  });
};

export default chatSocketHandler;
