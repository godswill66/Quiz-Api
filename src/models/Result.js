const mongoose = require('mongoose');


const attemptSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
totalPoints: { type: Number, required: true },
achievedPoints: { type: Number, required: true },
answers: [{ question: mongoose.Schema.Types.ObjectId, answerIndex: Number }],
}, { timestamps: true });


module.exports = mongoose.model('Result', attemptSchema);