const Question = require("../models/Question");
const Answer = require("../models/Answer");

exports.calculateScore = async (quizId, submittedAnswers) => {
  const questions = await Question.find({ quiz: quizId });

  let correctCount = 0;

  for (const question of questions) {
    const correctAnswer = await Answer.findOne({
      question: question._id,
      isCorrect: true,
    });

    const userAnswer = submittedAnswers[question._id];

    if (userAnswer && userAnswer == correctAnswer._id.toString()) {
      correctCount++;
    }
  }

  const totalQuestions = questions.length;
  const scorePercentage = (correctCount / totalQuestions) * 100;

  return {
    correctCount,
    totalQuestions,
    scorePercentage,
    grade: getGrade(scorePercentage),
  };
};

function getGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
