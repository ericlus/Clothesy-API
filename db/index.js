const { Client } = require("pg");
const { user, host, database, password } = require("../config.js");
var moment = require("moment");

const connectionString = `postgres://${user}:${password}@${host}:5432/${database}`;

const client = new Client({
  connectionString: connectionString
});
client.connect();

const getQuestions = (req, res) => {
  client
    .query(
      `SELECT json_agg(question_list) as questions
    FROM (SELECT *, (
      SELECT json_agg(answer_list) as answers FROM ( SELECT *, (
        SELECT json_agg(photo_list) as photos
        FROM (SELECT * FROM temp_photos WHERE answer_id = b.answer_id) photo_list
      ) FROM temp_answers as b WHERE question_id = a.question_id) answer_list
    ) FROM temp_questions as a WHERE product_id = ${req.params.product_id}) question_list`
    )
    .then(results => {
      res.send(results.rows[0].questions);
    })
    .catch(err => {
      console.log(err);
    });
};

const getAnswers = (req, res) => {
  client
    .query(
      `SELECT json_agg(answer_list) as answers FROM ( SELECT *, (
      SELECT json_agg(photo_list) as photos
      FROM (SELECT * FROM temp_photos WHERE answer_id = b.answer_id) photo_list
    ) FROM temp_answers as b WHERE question_id = ${req.params.question_id}) answer_list`
    )
    .then(results => {
      res.send(results.rows[0].answers);
    })
    .catch(err => {
      console.log(err);
    });
};

const postQuestion = (req, res) => {
  client
    .query(
      `INSERT INTO temp_questions ("product_id", "question_body",
     "question_date_written", "asker_name", "asker_email", "question_reported", "question_helpful")
     VALUES (${req.params.product_id}, '${req.body.question_body}', 
     '${moment().format("YYYY-MM-DD")}', '${req.body.asker_name}', 
     '${req.body.asker_email}', 0, 0)`
    )
    .then(() => {
      res.end();
    })
    .catch(err => {
      console.log(err);
    });
};

const postAnswer = (req, res) => {
  client
    .query(
      `INSERT INTO temp_answers ("question_id", "answer_body",
  "answer_date_written", "answer_name", "answerer_email", "answer_reported", "answer_helpful")
  VALUES (${req.params.question_id}, '${req.body.answer_body}',
  '${moment().format("YYYY-MM-DD")}', '${req.body.answer_name}',
  '${req.body.answerer_email}', 0, 0) RETURNING answer_id`
    )
    .then(results => {
      let answerId = results.rows[0].answer_id;
      return Promise.all(
        req.body.photo_url.map(photo => {
          return client.query(`INSERT INTO temp_photos ("answer_id", "photo_url")
        VALUES (${answerId}, '${photo}')`);
        })
      );
    })
    .then(() => {
      res.end();
    })
    .catch(err => {
      console.log(err);
    });
};

const markQuestionHelpful = (req, res) => {
  client
    .query(
      `UPDATE temp_questions SET question_helpful = question_helpful + 1
  WHERE question_id = ${req.params.question_id}`
    )
    .then(() => {
      res.end();
    })
    .catch(err => {
      console.log(err);
    });
};

const reportQuestion = (req, res) => {
  client
    .query(
      `UPDATE temp_questions SET question_reported = question_reported + 1
WHERE question_id = ${req.params.question_id}`
    )
    .then(() => {
      res.end();
    })
    .catch(err => {
      console.log(err);
    });
};

const markAnswerHelpful = (req, res) => {
  client
    .query(
      `UPDATE temp_answers SET answer_helpful = answer_helpful + 1
WHERE answer_id = ${req.params.answer_id}`
    )
    .then(() => {
      res.end();
    })
    .catch(err => {
      console.log(err);
    });
};

const reportAnswer = (req, res) => {
  client
    .query(
      `UPDATE temp_answers SET answer_reported = answer_reported + 1
WHERE answer_id = ${req.params.answer_id}`
    )
    .then(() => {
      res.end();
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = {
  getQuestions,
  getAnswers,
  postQuestion,
  postAnswer,
  markQuestionHelpful,
  reportQuestion,
  markAnswerHelpful,
  reportAnswer
};
