    🎓 Quiz-API EngineA robust, production-ready REST API for managing quizzes, questions, and grading. This project features a sophisticated  scoring engine that handles dynamic relationships between users, quizzes, and multiple-choice questions.

🚀 FeaturesSecure Authentication: JWT-based login and registration.Dynamic Quiz Management: Create, view, update, and archive quizzes.

Linked Question Architecture: Automatically links questions to quizzes using MongoDB $push.
Grading Engine: Real-time scoring with string comparison, array sorting, and automated grade assignment (A-F).Result Tracking: Persistent storage of user attempts with full quiz metadata population.

🛠️ API Documentation🔐 AuthenticationMethodEndpointDescriptionPOST/api/auth/registerRegister a new user account.

POST/api/auth/loginAuthenticate and receive a Bearer Token.📝 Quiz Management (The "Quiz" Logic)Create Quiz (POST /api/quizzes): Initialize a quiz container.

View All (GET /api/quizzes): Returns a list of all active quizzes.

Get by ID (GET /api/quizzes/:id): Fetches a specific quiz.Note: Uses .

populate("questions") to resolve Question IDs into full objects.Update Quiz (PUT /api/quizzes/:id): Edit title or description.Delete Quiz (DELETE /api/quizzes/:id): Performs a "Hard Delete" of the quiz and cleans up related questions.

Archive Quiz (PATCH /api/quizzes/:id/archive): Performs a "Soft Delete" by updating the status to archived.❓ Question & Answer ManagementAdd Question (POST /api/quizzes/:id/questions): Creates a question.

Logic: Automatically updates the parent Quiz model's questions array.Add Answer (POST /api/questions/:id/answers): Adds an option to a question.

Logic: Requires an isCorrect boolean for the grading engine.🏆 Grading & Results (The "Engine" Logic)Submit Quiz (POST /api/results/:quizId/submit):Logic: Maps user answers, sorts arrays for order-independent comparison, and calculates a percentage.

Grading Scale: Automated assignment based on percentage:$>= 90\%$: A$>= 75\%$: B$>= 60\%$: C$>= 50\%$: D$< 50\%$: FUser History (GET /api/results): Fetches the "Report Card" for the logged-in user.Filtered History (GET /api/results/:quizId): View attempts for one specific quiz.












                                                  💻 Technical Implementation Details
Data Integrity Logic
The project uses a "Bridge" logic to ensure data is never orphaned. When a question is created, it is pushed into the quiz array:


⚙️ Installation & Setup
Clone the Repository

Install Packages: npm install

Environment Setup: Create a .env file with:

Code snippet
PORT=3001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
Run Server: npm run dev or node src/server.js

🧪 Testing with Postman
Auth: Set the "Auth" tab to Bearer Token and paste the token from the login route.

Headers: Ensure Content-Type: application/json is set.

Body: Use the raw JSON format as documented in the routes section.