const mongoose = require('mongoose');


const answerSchema = new mongoose.Schema({
text: { type: String, required: true },
isCorrect: { type: Boolean, default: false },
});


const questionSchema = new mongoose.Schema({
quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
text: { type: String, required: true },
answers: { type: [answerSchema], validate: v => Array.isArray(v) && v.length >= 2 },
points: { type: Number, default: 1 },
}, { timestamps: true });


module.exports = mongoose.model('Question', questionSchema);