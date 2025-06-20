import { createQuestion, getLatestQuestion,getQuestionHistoryWithResults } from "../models/questionModel.js";


export const postQuestion = async (req, res) => {
  const { question, duration, options,sessionId} = req.body;
  
  if (
    !question ||
    !options ||
    !Array.isArray(options) ||
    options.length === 0 ||
    !sessionId
  ) {
    return res.status(400).json({
      error: "Invalid input. 'question', 'options', and 'sessionId' are required.",
    });
  }

  try {
    const io = req.app.get("io");
    if (!io) throw new Error("Socket.IO instance not set on app");

    const savedQuestion = await createQuestion(question, duration || 60, options, sessionId);

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

export const fetchQuestionHistory = async (req, res) => {
  const sessionId = req.query.sessionId;
  console.log(sessionId)
  if (!sessionId) {
    return res.status(400).json({ error: "Missing sessionId" });
  }

  try {
    const history = await getQuestionHistoryWithResults(sessionId);
    res.json(history);
  } catch (err) {
    console.error("❗ Error fetching poll history:", err);
    res.status(500).json({ error: "Failed to fetch poll history" });
  }
};
