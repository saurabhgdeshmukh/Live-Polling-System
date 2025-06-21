import pool from "../db/db.js";

export const createQuestion = async (question, duration, options, sessionId, createdAt) => {
  const result = await pool.query(
    `INSERT INTO questions (question, duration, session_id, created_at) 
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [question, duration, sessionId, createdAt]
  );

  const questionId = result.rows[0].id;

  const insertedOptions = [];

  for (const opt of options) {
    const res = await pool.query(
      `INSERT INTO options (text, question_id) VALUES ($1, $2) RETURNING id`,
      [opt.text, questionId]
    );
    insertedOptions.push({
      _id: res.rows[0].id, // real option ID
      text: opt.text,
    });
  }

  return {
    _id: questionId,
    question,
    duration,
    createdAt,
    options: insertedOptions,
  };
};



export const getLatestQuestion = async () => {
  try {
    const questionResult = await pool.query(
      `SELECT id, question, duration, created_at 
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
      createdAt: question.created_at, // ✅ include this
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


export const getQuestionHistoryWithResults = async (sessionId) => {
  const questions = await pool.query(
    `SELECT id, question, duration 
     FROM questions 
     WHERE session_id = $1 
     ORDER BY created_at DESC`,
    [sessionId]
  );

  const fullData = [];

  for (const q of questions.rows) {
    const optionsRes = await pool.query(
      `SELECT id, text FROM options WHERE question_id = $1`,
      [q.id]
    );

    const resultsRes = await pool.query(
      `SELECT answer_id, COUNT(*) AS count
       FROM answers
       WHERE question_id = $1
       GROUP BY answer_id`,
      [q.id]
    );

    fullData.push({
      _id: q.id,
      question: q.question,
      duration: q.duration,
      options: optionsRes.rows.map((o) => ({
        _id: o.id,
        text: o.text,
      })),
      results: resultsRes.rows.map((r) => ({
        optionId: r.answer_id,
        count: parseInt(r.count),
      })),
    });
  }

  return fullData;
};



