import express from "express";
import { postQuestion, fetchLatestQuestion } from "../controllers/questionController.js";

const router = express.Router();

router.post("/questions", postQuestion);
router.get("/questions/latest", fetchLatestQuestion);

export default router;
