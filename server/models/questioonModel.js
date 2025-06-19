import pool from "../db/db.js";

export const createQuestion = async (question, duration, options) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const questionResult = await client.query(
      "INSERT INTO questions (question, duration) VALUES ($1, $2) RETURNING id",
      [question, duration]
    );

    const questionId = questionResult.rows[0].id;

    for (let opt of options) {
      await client.query(
        "INSERT INTO options (question_id, text, is_correct) VALUES ($1, $2, $3)",
        [questionId, opt.text, opt.correct]
      );
    }

    await client.query("COMMIT");
    return questionId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getLatestQuestion = async () => {
  const result = await pool.query(
    `SELECT q.id, q.question, q.duration, json_agg(json_build_object('id', o.id, 'text', o.text, 'correct', o.is_correct)) as options
     FROM questions q
     JOIN options o ON q.id = o.question_id
     GROUP BY q.id
     ORDER BY q.id DESC
     LIMIT 1`
  );
  return result.rows[0];
};
