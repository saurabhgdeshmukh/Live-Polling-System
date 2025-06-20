import pool from "./db.js";

export const saveAnswer = async (questionId, user, answerId) => {
  await pool.query(
    `INSERT INTO answers (question_id, user_id, answer_id)
     VALUES ($1, $2, $3)`,
    [questionId, user, answerId]
  );
};



export const getLatestQuestionResults = async (questionId) => {
  const result = await pool.query(
    `SELECT answer_id AS option_id, COUNT(*) as count
     FROM answers
     WHERE question_id = $1
     GROUP BY answer_id`,
    [questionId]
  );
  return result.rows;
};

