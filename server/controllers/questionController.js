const {
  getDbQuestions,
  getDbAnswers,
  postDbQuestion,
  postDbAnswer,
  markDbQuestionHelpful,
  reportDbQuestion,
  markDbAnswerHelpful,
  reportDbAnswer
} = require("../models/questionModel.js");

const getQuestions = (req, res) => {
  getDbQuestions(req.params.product_id)
    .then(results => {
      res.send({
        product_id: req.params.product_id,
        results: results.rows[0]
      });
    })
    .catch(err => {
      console.log(err);
    });
};
const getAnswers = (req, res) => {
  getDbAnswers(req.params.question_id)
    .then(results => {
      res.send({ question: req.params.question_id, results: results.rows[0] });
    })
    .catch(err => {
      console.log(err);
    });
};
const postQuestion = (req, res) => {
  postDbQuestion(
    req.params.product_id,
    req.body.question_body,
    req.body.asker_name,
    req.body.asker_email
  )
    .then(() => {
      res.end();
    })
    .catch(err => {
      console.log(err);
    });
};
const postAnswer = (req, res) => {
  postDbAnswer(
    req.params.question_id,
    req.body.body,
    req.body.answerer_name,
    req.body.answerer_email
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
  markDbQuestionHelpful(req.params.question_id)
    .then(() => {
      res.end();
    })
    .catch(err => {
      console.log(err);
    });
};
const reportQuestion = (req, res) => {
  reportDbQuestion(req.params.question_id)
    .then(() => {
      res.end();
    })
    .catch(err => {
      console.log(err);
    });
};
const markAnswerHelpful = (req, res) => {
  markDbAnswerHelpful(req.params.answer_id)
    .then(() => {
      res.end();
    })
    .catch(err => {
      console.log(err);
    });
};
const reportAnswer = (req, res) => {
  reportDbAnswer(req.params.answer_id)
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
