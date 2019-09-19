const { Client } = require("pg");
const { user, host, database, password } = require("../config.js");

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
    ) FROM temp_questions as a WHERE product_id = 1) question_list`,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results.rows[0].questions[1].answers[0].photos);
      res.end();
    }
  );
};

module.exports = { getQuestions };
