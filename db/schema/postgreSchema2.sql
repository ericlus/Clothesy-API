DROP DATABASE IF EXISTS qna;

CREATE DATABASE qna;

\c qna

DROP TABLE IF EXISTS temp_questions;
DROP TABLE IF EXISTS temp_answers;
DROP TABLE IF EXISTS temp_photos;

CREATE TABLE temp_questions (
    question_id SERIAL PRIMARY KEY,
    product_id INT,
    question_body VARCHAR,
    question_date_written VARCHAR,
    asker_name VARCHAR,
    asker_email VARCHAR,
    question_reported INT,
    question_helpful INT
);

CREATE TABLE temp_answers (
    answer_id SERIAL PRIMARY KEY,
    question_id INT,
    answer_body VARCHAR,
    answer_date_written VARCHAR,
    answer_name VARCHAR,
    answerer_email VARCHAR,
    answer_reported INT,
    answer_helpful INT
);

CREATE TABLE temp_photos (
    photo_id SERIAL PRIMARY KEY,
    answer_id INT,
    photo_url VARCHAR
);

ALTER TABLE temp_answers ADD FOREIGN KEY (question_id) REFERENCES temp_questions (question_id);
ALTER TABLE temp_photos ADD FOREIGN KEY (answer_id) REFERENCES temp_answers (answer_id);

\COPY temp_questions FROM '../../qnaData/questions.csv' CSV HEADER;
\COPY temp_answers FROM '../../qnaData/answers.csv' CSV HEADER;
\COPY temp_photos FROM '../../qnaData/answers_photos.csv' CSV HEADER;

CREATE INDEX CONCURRENTLY product_index ON temp_questions(product_id);
CREATE INDEX CONCURRENTLY question_index ON temp_answers(question_id);
CREATE INDEX CONCURRENTLY answer_index ON temp_photos(answer_id);

ALTER SEQUENCE temp_questions_question_id_seq RESTART WITH 3521635;
ALTER SEQUENCE temp_answers_answer_id_seq RESTART WITH 12392947;
ALTER SEQUENCE temp_photos_photo_id_seq RESTART WITH 3717893;