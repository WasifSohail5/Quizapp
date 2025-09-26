// backend/models/Question.js
const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  textEN: { type: String, required: true },
  textMS: { type: String, required: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ["Algebra", "Trigonometry", "Profit & Loss"], 
    required: true 
  },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  timeRefSec: { type: Number, default: 60 },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("Question", QuestionSchema);
