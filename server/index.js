const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const {
  getQuestions,
  getAnswers,
  postQuestion,
  postAnswer
} = require("../db/index.js");

const port = process.env.PORT || 3000;

const questionsData = path.join(__dirname, "../data/questions.csv");
const answersData = path.join(__dirname, "../data/answers.csv");
const photosData = path.join(__dirname, "../data/answers_photos.csv");

app.use(bodyParser.json());

app.get("/qa/:product_id", getQuestions);
app.get("/qa/:question_id/answers", getAnswers);
app.post("/qa/:product_id", postQuestion);
app.post("/qa/:question_id/answers", postAnswer);

app.listen(port, () => {
  console.log("connected to server");
});
