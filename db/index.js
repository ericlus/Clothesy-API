const { Pool } = require("pg");
const moment = require("moment");
const configInfo = require("../config.js");

const connectInfo = {
  user: process.env.DB_USER || configInfo.user,
  host: process.env.DB_HOST || configInfo.host,
  database: process.env.DB_DB || configInfo.database,
  password: process.env.DB_PASSWORD || configInfo.password
};

const connectionString = `postgres://${connectInfo.user}:${connectInfo.password}@${connectInfo.host}:5432/${connectInfo.database}`;
let pool;
const connectDB = () => {
  pool = new Pool({
    connectionString: connectionString
  });

  pool.connect(err => {
    if (err) {
      console.log(err);
      pool.end();
      setTimeout(connectDB, 5000);
    }
    console.log("connected to db");
  });
};

connectDB();

const getQuestions = (req, res) => {
  pool
    .query(
      `SELECT json_agg(question_list) as results
    FROM (SELECT *, (
      SELECT COALESCE (json_agg(answer_list), '[]') as answers FROM ( SELECT *, (
        SELECT COALESCE (json_agg(photo_list), '[]') as photos FROM (
          SELECT "url" FROM temp_photos WHERE answer_id = b.answer_id) photo_list
      ) FROM temp_answers as b WHERE question_id = a.question_id) answer_list
    ) FROM temp_questions as a WHERE product_id = ${req.params.product_id}) question_list`
    )
    .then(results => {
      let filteredQuestions = results.rows[0].results.filter(question => {
        return question.reported === 0;
      });
      filteredQuestions.forEach(question => {
        question.answers = question.answers.filter(answer => {
          return answer.answer_reported === 0;
        });
      });
      res.send({
        product_id: req.params.product_id,
        results: filteredQuestions
      });
    })
    .catch(err => {
      console.log(err);
    });
};

const getAnswers = (req, res) => {
  pool
    .query(
      `SELECT COALESCE (json_agg(answer_list), '[]') as answers FROM ( SELECT *, (
      SELECT COALESCE (json_agg(photo_list), '[]') as photos
      FROM (SELECT * FROM temp_photos WHERE answer_id = b.answer_id) photo_list
    ) FROM temp_answers as b WHERE question_id = ${req.params.question_id}) answer_list`
    )
    .then(results => {
      let filteredAnswers = results.rows[0].answers.filter(answer => {
        return answer.answer_reported === 0;
      });
      res.send({ question: req.params.question_id, results: filteredAnswers });
    })
    .catch(err => {
      console.log(err);
    });
};

const postQuestion = (req, res) => {
  pool
    .query(
      `INSERT INTO temp_questions ("product_id", "question_body",
     "question_date", "asker_name", "asker_email", "reported", "question_helpfulness")
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
  pool
    .query(
      `INSERT INTO temp_answers ("question_id", "body",
  "date", "answerer_name", "answerer_email", "answer_reported", "helpfulness")
  VALUES (${req.params.question_id}, '${req.body.body}',
  '${moment().format("YYYY-MM-DD")}', '${req.body.answerer_name}',
  '${req.body.answerer_email}', 0, 0) RETURNING answer_id`
    )
    .then(results => {
      let answerId = results.rows[0].answer_id;
      return Promise.all(
        req.body.url.map(photo => {
          return pool.query(`INSERT INTO temp_photos ("answer_id", "url")
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
  pool
    .query(
      `UPDATE temp_questions SET question_helpfulness = question_helpfulness + 1
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
  pool
    .query(
      `UPDATE temp_questions SET reported = reported + 1
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
  pool
    .query(
      `UPDATE temp_answers SET helpfulness = helpfulness + 1
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
  pool
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
