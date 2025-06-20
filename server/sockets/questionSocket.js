import { getLatestQuestionResults, saveAnswer } from "../db/results.js"; // you must define these
import { getLatestQuestion } from "../models/questionModel.js"; // NOT from controller

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Handle student submitting an answer
    socket.on("question:submit_answer", async ({ questionId, user, answerId }) => {
      try {
        console.log(`📥 Answer received from ${user}:`, { questionId, answerId });

        // Save the answer
        await saveAnswer(questionId, user, answerId);

        // Get updated results
        const results = await getLatestQuestionResults(questionId); // Format: [{ optionId, count }, ...]
        console.log("📊 Emitting updated results:", results);

        // Emit to all clients
        io.emit("question:results", results);
      } catch (err) {
        console.error("❗ Error handling answer submission:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
