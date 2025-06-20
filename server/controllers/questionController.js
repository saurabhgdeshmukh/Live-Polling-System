import { createQuestion, getLatestQuestion } from "../models/questionModel.js";


export const postQuestion = async (req, res) => {
  const { question, duration, options } = req.body;

  if (!question || !options || !Array.isArray(options) || options.length === 0) {
    return res.status(400).json({ error: "Invalid input. 'question' and 'options' are required." });
  }

  try {
    const io = req.app.get("io");
    if (!io) throw new Error("Socket.IO instance not set on app");

    const savedQuestion = await createQuestion(question, duration || 60, options);

    io.emit("question:active", savedQuestion); // broadcast to all clients
    console.log("✅ Emitted question:active", savedQuestion);

    res.status(201).json({
      message: "Question created and broadcasted",
      question: savedQuestion,
    });
  } catch (err) {
    console.error("❗ Error in postQuestion:", err);
    res.status(500).json({
      error: "Failed to create question",
      detail: err.message,
    });
  }
};

/**
 * @desc Fetch the latest question
 */
export const fetchLatestQuestion = async (req, res) => {
  try {
    const question = await getLatestQuestion();

    if (!question) {
      return res.status(404).json({ error: "No question found" });
    }

    res.status(200).json(question);
  } catch (err) {
    console.error("❗ Error in fetchLatestQuestion:", err);
    res.status(500).json({ error: "Failed to fetch latest question" });
  }
};
