const { Client } = require("pg");
const { user, host, database, password } = require("../config.js");
var moment = require("moment");

const connectionString = `postgres://${user}:${password}@${host}:5432/${database}`;

const client = new Client({
  connectionString: connectionString
});
client.connect();

const getQuestions = (req, res) => {
  client.query(
    `SELECT json_agg(question_list) as questions
    FROM (SELECT *, (
      SELECT json_agg(answer_list) as answers FROM ( SELECT *, (
        SELECT json_agg(photo_list) as photos
        FROM (SELECT * FROM temp_photos WHERE answer_id = b.answer_id) photo_list
      ) FROM temp_answers as b WHERE question_id = a.question_id) answer_list
    ) FROM temp_questions as a WHERE product_id = ${req.params.product_id}) question_list`,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results.rows[0].questions);
    }
  );
};

const getAnswers = (req, res) => {
  client.query(
    `SELECT json_agg(answer_list) as answers FROM ( SELECT *, (
      SELECT json_agg(photo_list) as photos
      FROM (SELECT * FROM temp_photos WHERE answer_id = b.answer_id) photo_list
    ) FROM temp_answers as b WHERE question_id = ${req.params.question_id}) answer_list
  `,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results.rows[0].answers);
    }
  );
};

const postQuestion = (req, res) => {
  client.query(
    `INSERT INTO temp_questions ("product_id", "question_body",
     "question_date_written", "asker_name", "asker_email", "question_reported", "question_helpful")
     VALUES (${req.params.product_id}, '${req.body.question_body}', 
     '${moment().format("YYYY-MM-DD")}', '${req.body.asker_name}', 
     '${req.body.asker_email}', 0, 0)`,
    err => {
      if (err) {
        console.log(err);
      } else {
        res.end();
      }
    }
  );
};

const postAnswer = (req, res) => {
  client.query(
    `INSERT INTO temp_answers ("question_id", "answer_body", 
  "answer_date_written", "answer_name", "answerer_email", "answer_reported", "answer_helpful")
  VALUES (${req.params.question_id}, '${req.body.answer_body}', 
  '${moment().format("YYYY-MM-DD")}', '${req.body.answer_name}', 
  '${req.body.answerer_email}', 0, 0)`,
    err => {
      if (err) {
        console.log(err);
      } else {
        res.end();
      }
    }
  );
};

module.exports = { getQuestions, getAnswers, postQuestion, postAnswer };
