import pool from "../db/db.js";

export const createQuestion = async (question, duration, options) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const questionResult = await client.query(
      "INSERT INTO questions (question, duration) VALUES ($1, $2) RETURNING id, question, duration",
      [question, duration]
    );

    const questionId = questionResult.rows[0].id;

    for (let opt of options) {
      await client.query(
        "INSERT INTO options (question_id, text, is_correct) VALUES ($1, $2, $3)",
        [questionId, opt.text, opt.correct]
      );
    }

    const optionsResult = await client.query(
      "SELECT id, text FROM options WHERE question_id = $1",
      [questionId]
    );

    await client.query("COMMIT");

    return {
      _id: questionId,
      question: questionResult.rows[0].question,
      duration: questionResult.rows[0].duration,
      options: optionsResult.rows.map((o) => ({
        _id: o.id,
        text: o.text,
      })),
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release(); // ✅ correct way
  }
};

export const getLatestQuestion = async () => {
  // const pool = await pool.connect();
  try {
    const questionResult = await pool.query(
      `SELECT id, question, duration 
       FROM questions 
       ORDER BY created_at DESC 
       LIMIT 1`
    );

    if (questionResult.rows.length === 0) return null;

    const question = questionResult.rows[0];

    const optionsResult = await pool.query(
      `SELECT id, text 
       FROM options 
       WHERE question_id = $1`,
      [question.id]
    );

    return {
      _id: question.id,
      question: question.question,
      duration: question.duration,
      options: optionsResult.rows.map((opt) => ({
        _id: opt.id,
        text: opt.text,
      })),
    };
  } catch (error) {
    console.error("Error in getLatestQuestion:", error);
    throw error;
  }
};
