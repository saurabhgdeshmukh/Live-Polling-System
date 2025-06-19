import { createQuestion, getLatestQuestion } from "../models/questionModel.js";


export const postQuestion = async (req, res) => {
  const { question, duration, options } = req.body;
  console.log(question)
  try {
    const io = req.app.get("io"); // ✅ Get the socket instance
    const savedQuestion = await createQuestion(question, duration, options);

    // Emit the question to all clients
    io.emit("question:active", savedQuestion);
console.log("Emitting question:active", savedQuestion);

    res.status(201).json({ message: "Question created", questionId: savedQuestion._id });
  } catch (err) {
  console.error("❗️ Error in postQuestion:", err);
  console.error("Request body was:", req.body);
  res.status(500).json({ error: "Failed to create question", detail: err.message });
}

};

export const fetchLatestQuestion = async (req, res) => {
  try {
    const question = await getLatestQuestion();
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch question" });
  }
};
