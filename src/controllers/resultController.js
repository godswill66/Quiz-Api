const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const Joi = require('joi');
const validateObjectId = require('../utils/validateObjectId');


const attemptSchema = Joi.object({ answers: Joi.array().items(Joi.object({ question: Joi.string().required(), answerIndex: Joi.number().required() })) });


exports.submitAttempt = async (req, res) => {
const quizId = req.params.quizId;
if (!validateObjectId(quizId)) return res.status(400).json({ message: 'Invalid quiz id' });
const { error, value } = attemptSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.message });
const quiz = await Quiz.findById(quizId);
if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
if (!quiz.isPublished) return res.status(403).json({ message: 'Quiz not published' });


// Load questions
const questionIds = value.answers.map(a => a.question);
const questions = await Question.find({ _id: { $in: questionIds } });
// score
let totalPoints = 0;
let achievedPoints = 0;
const answerRecords = [];


for (const q of questions) {
totalPoints += q.points || 1;
const provided = value.answers.find(a => a.question === String(q._id));
if (!provided) continue;
const idx = provided.answerIndex;
const chosen = q.answers[idx];
if (!chosen) continue; // invalid index
answerRecords.push({ question: q._id, answerIndex: idx });
if (chosen.isCorrect) achievedPoints += q.points || 1;
}


const result = await Result.create({ user: req.user._id, quiz: quizId, totalPoints, achievedPoints, answers: answerRecords });
res.status(201).json({ resultId: result._id, totalPoints, achievedPoints });
};


exports.getUserResults = async (req, res) => {
const results = await Result.find({ user: req.user._id }).populate('quiz', 'title');
res.json(results);
};


exports.getQuizResults = async (req, res) => {
// only owner or admin
const quizId = req.params.quizId;
if (!validateObjectId(quizId)) return res.status(400).json({ message: 'Invalid quiz id' });
const quiz = await Quiz.findById(quizId);
if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
if (!quiz.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
const results = await Result.find({ quiz: quizId }).populate('user', 'name email');
res.json(results);
};