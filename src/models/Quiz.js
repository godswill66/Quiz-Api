const mongoose = require('mongoose');


const quizSchema = new mongoose.Schema({
title: { type: String, required: true },
description: { type: String },
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
isPublished: { type: Boolean, default: false },
level: { type: String, enum: ['easy','medium','hard'], default: 'easy' },
}, { timestamps: true });


module.exports = mongoose.model('Quiz', quizSchema);