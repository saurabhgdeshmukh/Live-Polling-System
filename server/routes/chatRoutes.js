// routes/chatRoutes.js
import express from "express";
const router = express.Router();
import  getAllMessages from "../models/chatModel.js";

router.get("/messages", async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
