import { createQuestion, getLatestQuestion } from "../models/questionModel.js";

export const postQuestion = async (req, res) => {
  const { question, duration, options } = req.body;
  try {
    const id = await createQuestion(question, duration, options);
    res.status(201).json({ message: "Question created", questionId: id });
  } catch (err) {
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
