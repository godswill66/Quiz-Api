// Import the Mongoose Question model
const Question = require("../models/Question");
// Import the Mongoose Answer model (used for referenced answers)
const Answer = require("../models/Answer");

/**
 * @desc    Calculates the final score and grade for a submitted quiz.
 * @param   {string} quizId - The MongoDB ObjectId of the quiz being submitted.
 * @param   {object} submittedAnswers - An object/map where keys are question IDs and values are submitted answer IDs.
 * @returns {Promise<object>} An object containing score metrics (count, total, percentage, grade).
 */
exports.calculateScore = async (quizId, submittedAnswers) => {
  // Fetch all questions pertaining to this quiz ID
  const questions = await Question.find({ quiz: quizId });

  let correctCount = 0;

  // Iterate through each question to compare submitted answers with correct answers
  for (const question of questions) {
    // For each question, find the single correct answer in the separate Answer collection
    // Note: This approach requires multiple DB lookups within a loop, which can be inefficient for large quizzes.
    const correctAnswer = await Answer.findOne({
      question: question._id,
      isCorrect: true,
    });

    // Retrieve the user's submitted answer for the current question ID
    const userAnswer = submittedAnswers[question._id];

    // Compare the user's answer ID string with the correct answer's ID string
    if (userAnswer && userAnswer == correctAnswer._id.toString()) {
      correctCount++; // Increment if they match
    }
  }

  // Calculate final metrics
  const totalQuestions = questions.length;
  const scorePercentage = (correctCount / totalQuestions) * 100 || 0; // Default to 0 if no questions exist

  // Return a structured results object
  return {
    correctCount,
    totalQuestions,
    scorePercentage,
    grade: getGrade(scorePercentage),
  };
};

/**
 * @desc    Helper function to determine a letter grade based on a percentage score.
 * @param   {number} score - The score percentage (0-100).
 * @returns {string} The corresponding letter grade (A, B, C, D, or F).
 */
function getGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
