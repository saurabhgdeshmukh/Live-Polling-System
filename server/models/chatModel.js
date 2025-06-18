// models/chatModel.js
import pool from "../db/db.js";



const saveMessage = async (sender, message) => {
  return await pool.query(
    "INSERT INTO chat_messages (sender, message) VALUES ($1, $2)",
    [sender, message]
  );
};

const getAllMessages = async () => {
  const res = await pool.query(
    "SELECT * FROM chat_messages ORDER BY sent_at ASC"
  );
  return res.rows;
};

export default {
  saveMessage,
  getAllMessages,
};
