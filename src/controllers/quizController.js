const Quiz = require('../models/Quiz');
const validateObjectId = require('../utils/validateObjectId');
const Joi = require('joi');


const quizSchema = Joi.object({ title: Joi.string().required(), description: Joi.string().allow(''), isPublished: Joi.boolean(), level: Joi.string().valid('easy','medium','hard') });


exports.createQuiz = async (req, res) => {
const { error, value } = quizSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.message });
const quiz = await Quiz.create({ ...value, owner: req.user._id });
res.status(201).json(quiz);
};


exports.getQuizzes = async (req, res) => {
// list public quizzes or owned by user
const { mine } = req.query;
const filter = mine === 'true' ? { owner: req.user._id } : { isPublished: true };
const quizzes = await Quiz.find(filter).populate('owner', 'name email');
res.json(quizzes);
};


exports.getQuiz = async (req, res) => {
const id = req.params.id;
if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
const quiz = await Quiz.findById(id).populate('owner', 'name email');
if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
if (!quiz.isPublished && !quiz.owner._id.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
res.json(quiz);
};


exports.updateQuiz = async (req, res) => {
const id = req.params.id;
if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
const quiz = await Quiz.findById(id);
if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
if (!quiz.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
const { error, value } = quizSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.message });
Object.assign(quiz, value);
await quiz.save();
res.json(quiz);
};


exports.deleteQuiz = async (req, res) => {
const id = req.params.id;
if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
const quiz = await Quiz.findById(id);
if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
if (!quiz.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
await quiz.remove();
res.json({ message: 'Deleted' });
};