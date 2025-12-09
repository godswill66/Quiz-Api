const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const Joi = require('joi');
const validateObjectId = require('../utils/validateObjectId');


const answerSchema = Joi.object({ text: Joi.string().required(), isCorrect: Joi.boolean().required() });
const questionSchema = Joi.object({ text: Joi.string().required(), answers: Joi.array().items(answerSchema).min(2), points: Joi.number().min(0) });


exports.addQuestion = async (req, res) => {
const quizId = req.params.quizId;
if (!validateObjectId(quizId)) return res.status(400).json({ message: 'Invalid quiz id' });
const quiz = await Quiz.findById(quizId);
if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
if (!quiz.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
const { error, value } = questionSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.message });
const question = await Question.create({ ...value, quiz: quizId });
res.status(201).json(question);
};


exports.getQuestions = async (req, res) => {
const quizId = req.params.quizId;
if (!validateObjectId(quizId)) return res.status(400).json({ message: 'Invalid quiz id' });
const questions = await Question.find({ quiz: quizId }).select('-answers.isCorrect');
res.json(questions);
};


exports.getQuestionForEdit = async (req, res) => {
// returns full question including correct flags (only owner/admin)
const id = req.params.id;
if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
const question = await Question.findById(id).populate('quiz');
if (!question) return res.status(404).json({ message: 'Question not found' });
if (!question.quiz.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
res.json(question);
};


exports.updateQuestion = async (req, res) => {
const id = req.params.id;
if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
const question = await Question.findById(id).populate('quiz');
if (!question) return res.status(404).json({ message: 'Question not found' });
if (!question.quiz.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
const { error, value } = questionSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.message });
Object.assign(question, value);
await question.save();
res.json(question);
};


exports.deleteQuestion = async (req, res) => {
const id = req.params.id;
if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
const question = await Question.findById(id).populate('quiz');
if (!question) return res.status(404).json({ message: 'Question not found' });
if (!question.quiz.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
await question.remove();
res.json({ message: 'Deleted' });
};