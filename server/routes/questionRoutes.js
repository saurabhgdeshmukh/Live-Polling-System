import express from "express";
import { postQuestion, fetchLatestQuestion,fetchQuestionHistory, } from "../controllers/questionController.js";

const router = express.Router();

router.post("/questions", postQuestion);
router.get("/questions/latest", fetchLatestQuestion);
router.get("/history", fetchQuestionHistory);
export default router;
