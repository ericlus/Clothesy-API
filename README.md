# Clothesy-API

Redesigned question and answers API for Clothesy (Shopping Application)

**List Questions**

`
GET /qa/:product_id
`
Retrieves a list of questions for a particular product.

**Parameters**

|  Parameter    |     Type      | Description   |
| ------------- | ------------- | ------------- |
| product_id | integer | Specifies the product for which to retrieve questions.|


**Answers List**

`
GET /qa/:question_id/answers
`
Returns answers for a given question.

Parameters

|  Parameter    |     Type      | Description   |
| ------------- | ------------- | ------------- |
| question_id | integer | Specifies the question for which to retrieve questions.|

**Add a Question**

`
POST /qa/:product_id
`
Adds a question for the given product


Parameters

|  Parameter    |     Type      | Description   |
| ------------- | ------------- | ------------- |
| product_id | integer | Required ID of the Product to post the question for.|

Body Parameters

|  Parameter    |     Type      | Description   |
| ------------- | ------------- | ------------- |
| body | text | Text of question being asked |
| name | text | Username for question asker |
| email | text | Email address for question asker |

**Add an Answer**

`
POST /qa/:question_id/answers
`
Adds an answer for the given question

Parameters

|  Parameter    |     Type      | Description   |
| ------------- | ------------- | ------------- |
| question_id | integer | Required ID of the question to post the answer for.|

Body Parameters

|  Parameter    |     Type      | Description   |
| ------------- | ------------- | ------------- |
| body | text | Text of answer |
| name | text | Username for answerer |
| email | text | Email address for answerer |
| photos | [text] | An array of urls corresponding to images to display |

**Mark Question as Helpful**

`
PUT /qa/question/:question_id/helpful
`
Updates a question to show it was found helpful.

Parameters

|  Parameter    |     Type      | Description   |
| ------------- | ------------- | ------------- |
| question_id | integer | Required ID of the question to update |

**Report Question**

`
PUT /qa/question/:question_id/report
`
Updates a question to show it was reported.


|  Parameter    |     Type      | Description   |
| ------------- | ------------- | ------------- |
| question_id | integer | Required ID of the question to update |

**Mark Answer as Helpful**

`
PUT /qa/answer/:answer_id/helpful
`
Updates an answer to show it was found helpful.


|  Parameter    |     Type      | Description   |
| ------------- | ------------- | ------------- |
| answer_id | integer | Required ID of the answer to update |

**Report Answer**

`
PUT /qa/answer/:answer_id/report
`
Updates an answer to show it has been reported.


|  Parameter    |     Type      | Description   |
| ------------- | ------------- | ------------- |
| answer_id | integer | Required ID of the answer to update |

