const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  participantId: { type: String, required: true },
  score: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  answers: [{ questionId: String, answer: String, time: Number }],
  badges: [String],
});

module.exports = mongoose.model('Score', scoreSchema);