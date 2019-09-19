DROP DATABASE IF EXISTS qna;

CREATE DATABASE qna;

\c qna

DROP TABLE IF EXISTS temp_questions;
DROP TABLE IF EXISTS temp_answers;
DROP TABLE IF EXISTS temp_photos;

CREATE TABLE temp_questions (
    question_id INT NOT NULL PRIMARY KEY,
    product_id INT,
    question_body VARCHAR,
    question_date_written VARCHAR,
    asker_name VARCHAR,
    asker_email VARCHAR,
    question_reported INT,
    question_helpful INT
);

CREATE TABLE temp_answers (
    answer_id INT NOT NULL PRIMARY KEY,
    question_id INT,
    answer_body VARCHAR,
    answer_date_written VARCHAR,
    answer_name VARCHAR,
    answerer_email VARCHAR,
    answer_reported INT,
    answer_helpful INT
);

CREATE TABLE temp_photos (
    photo_id INT NOT NULL PRIMARY KEY,
    answer_id INT,
    photo_url VARCHAR
);

\COPY temp_questions FROM '../../data/questions.csv' CSV HEADER;
\COPY temp_answers FROM '../../data/answers.csv' CSV HEADER;
\COPY temp_photos FROM '../../data/answers_photos.csv' CSV HEADER;

CREATE INDEX question_index ON temp_answers(question_id);
CREATE INDEX answer_index ON temp_photos(answer_id);