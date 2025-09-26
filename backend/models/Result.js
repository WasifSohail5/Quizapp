const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  participantId: { type: String, required: true, unique: true },
  teamName: { type: String, required: true },
  grade: { type: String, required: true },
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", ResultSchema);
