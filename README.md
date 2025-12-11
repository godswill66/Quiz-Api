src/
 ├── config/
 │    └── db.js
 ├── controllers/
 │    ├── authController.js
 │    ├── quizController.js
 │    ├── questionController.js
 │    ├── answerController.js
 │    └── resultController.js
 ├── middleware/
 │    ├── auth.js
 │    ├── roles.js
 │    └── errorHandler.js
 ├── models/
 │    ├── User.js
 │    ├── Quiz.js
 │    ├── Question.js
 │    ├── Answer.js
 │    └── Result.js
 ├── routes/
 │    ├── auth.js
 │    ├── quizzes.js
 │    ├── questions.js
 │    ├── answers.js
 │    └── results.js
 ├── utils/
 │    └── validateObjectId.js
 └── server.js



📦 Installation


1️⃣ Clone repo

git clone https://github.com/godswill66/Quiz-Api.git
cd Quiz-Api

2️⃣ Install dependencies
npm install


 3️⃣ Setup environment variables

Create a .env file:

PORT=4000
MONGO_URI=mongodb://localhost:27017/quiz-api
JWT_SECRET=your-secret-here
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10


4️⃣ Start server
npm run dev   # with nodemon


🔐 Authentication (JWT)
Register
POST /api/auth/register


Body:

{
  "name": "User",
  "email": "user@test.com",
  "password": "password123"
}

Login
POST /api/auth/login

Returns:

{
  "token": "JWT_TOKEN",
  "user": { "id": "...", "email": "..." }
}

Use Token
Authorization: Bearer <token>

Create Quiz
POST /api/quizzes


Body:

{
  "title": "JavaScript Basics",
  "description": "Simple JS quiz"
}

Update Quiz
PUT /api/quizzes/:id

Delete Quiz
DELETE /api/quizzes/:id

Archive/Unarchive Quiz
PATCH /api/quizzes/:id/archive


Body:

{ "status": "archived" }

Get all user quizzes
GET /api/quizzes

Get single quiz (with questions + answers)
GET /api/quizzes/:id

❓ QUESTION MANAGEMENT
Add Question
POST /api/questions/:quizId


Body:

{
  "text": "What is JavaScript?",
  "helpText": "One correct answer",
  "type": "single"
}

Update Question
PUT /api/questions/:id

Delete Question
DELETE /api/questions/:id

📝 ANSWER MANAGEMENT
Add Answer
POST /api/answers/:questionId


Body:

{
  "text": "A programming language",
  "isCorrect": true
}

Update Answer
PUT /api/answers/:questionId/:answerId

Delete Answer
DELETE /api/answers/:questionId/:answerId

🧮 QUIZ SUBMISSION & SCORING
Submit Quiz
POST /api/results/submit


Body example:

{
  "quizId": "12345",
  "answers": [
    {
      "questionId": "q1",
      "selectedAnswers": ["Answer Text"]
    }
  ]
}


Response:

{
  "correct_answers": 8,
  "total_questions": 10,
  "total_questions_answered": 10,
  "score_percentage": 80,
  "grade": "B",
  "result": { ... }
}

🛡 Security Features

✔ JWT authentication
✔ Access control → users manage only their quizzes
✔ validateObjectId on all routes
✔ Server-side input validation
✔ Protected routes
✔ Prevents cross-user access

🚀 Technologies Used

Node.js

Express.js

MongoDB + Mongoose

JWT

bcryptjs

dotenv

Nodemon

🧪 Testing Tools

Postman collection

MongoDB Compass

Thunder Client (VS Code)

📄 License

MIT License.