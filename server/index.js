const express = require("express");
const app = express();
const path = require("path");
const { getQuestions } = require("../db/index.js");

const questionsData = path.join(__dirname, "../data/questions.csv");
const answersData = path.join(__dirname, "../data/answers.csv");
const photosData = path.join(__dirname, "../data/answers_photos.csv");

app.get("/", getQuestions);

app.listen(3000, () => {
  console.log("connected to server");
});
