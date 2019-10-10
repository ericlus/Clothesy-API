const moment = require("moment");
const pool = require("../../db/index.js");

const getDbQuestions = productId => {
  return pool.query(
    `SELECT json_agg(question_list) as results
        FROM (SELECT *, (
          SELECT COALESCE (json_agg(answer_list), '[]') as answers FROM ( SELECT *, (
            SELECT COALESCE (json_agg(photo_list), '[]') as photos FROM (
              SELECT "url" FROM temp_photos WHERE answer_id = b.answer_id) photo_list
          ) FROM temp_answers as b WHERE question_id = a.question_id) answer_list
        ) FROM temp_questions as a WHERE product_id = ${productId}) question_list`
  );
};

const getDbAnswers = questionId => {
  return pool.query(
    `SELECT COALESCE (json_agg(answer_list), '[]') as answers FROM ( SELECT *, (
        SELECT COALESCE (json_agg(photo_list), '[]') as photos
        FROM (SELECT * FROM temp_photos WHERE answer_id = b.answer_id) photo_list
      ) FROM temp_answers as b WHERE question_id = ${questionId}) answer_list`
  );
};

const postDbQuestion = (productId, questionBody, askerName, askerEmail) => {
  return pool.query(
    `INSERT INTO temp_questions ("product_id", "question_body",
       "question_date", "asker_name", "asker_email", "reported", "question_helpfulness")
       VALUES (${productId}, '${questionBody}',
       '${moment().format("YYYY-MM-DD")}', '${askerName}',
       '${askerEmail}', 0, 0)`
  );
};

const postDbAnswer = (questionId, body, answererName, answererEmail) => {
  return pool.query(
    `INSERT INTO temp_answers ("question_id", "body",
    "date", "answerer_name", "answerer_email", "answer_reported", "helpfulness")
    VALUES (${questionId}, '${body}',
    '${moment().format("YYYY-MM-DD")}', '${answererName}',
    '${answererEmail}', 0, 0) RETURNING answer_id`
  );
};

const markDbQuestionHelpful = questionId => {
  return pool.query(
    `UPDATE temp_questions SET question_helpfulness = question_helpfulness + 1
    WHERE question_id = ${questionId}`
  );
};

const reportDbQuestion = questionId => {
  return pool.query(
    `UPDATE temp_questions SET reported = reported + 1
  WHERE question_id = ${questionId}`
  );
};

const markDbAnswerHelpful = answerId => {
  return pool.query(
    `UPDATE temp_answers SET helpfulness = helpfulness + 1
  WHERE answer_id = ${answerId}`
  );
};

const reportDbAnswer = answerId => {
  return pool.query(
    `UPDATE temp_answers SET answer_reported = answer_reported + 1
  WHERE answer_id = ${answerId}`
  );
};

module.exports = {
  getDbQuestions,
  getDbAnswers,
  postDbQuestion,
  postDbAnswer,
  markDbQuestionHelpful,
  reportDbQuestion,
  markDbAnswerHelpful,
  reportDbAnswer
};
