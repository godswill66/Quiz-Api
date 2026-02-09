                                                       HOW TO USE THIS DOCUMENT
                   This document serves as a comprehensive guide to the API endpoints for a quiz application. It is organized



🔐 1. Authentication (Auth)
POST /api/auth/register: Creates a new user.

POST /api/auth/login: Authenticates user and returns a JWT Token.

Note: This token must be used in the Authorization header for all other routes.

📝 2. Quiz Management
POST /api/quizzes: Create a new quiz.

GET /api/quizzes: View All quizzes.

GET /api/quizzes/:id: Get by ID.

Logic fixed: Uses .populate("questions") to show full question data.

PUT /api/quizzes/:id: Update quiz metadata (Title, Description).

DELETE /api/quizzes/:id: Delete a quiz and its orphaned questions.

PATCH /api/quizzes/:id/archive: Soft Delete by changing status to "archived".

❓ 3. Question & Answer Logic
POST /api/quizzes/:id/questions: Create a question and link it to a quiz.

Logic fixed: Uses $push to add the questionId into the Quiz model's questions array.

POST /api/questions/:id/answers: Add an answer to a specific question.

Logic: One answer must have isCorrect: true for the grading engine to work.

🏆 4. Results & Grading Engine
POST /api/results/:quizId/submit: The core grading logic.

Input: An array of answers containing questionId and selectedAnswers (text).

Logic: Compares user input against the database using JSON.stringify and calculates a percentage.

Output: Returns a Score (0-100) and a Grade (A-F).

GET /api/results: View All results for the logged-in user.

GET /api/results/:quizId: Get by ID (specific results for one quiz).