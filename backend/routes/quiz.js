// backend/routes/quiz.js
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// GET /api/quiz?total=30&grade=10
router.get("/", async (req, res) => {
  const total = parseInt(req.query.total) || 30;
  const grade = req.query.grade || null; // (optional) filter by grade

  // Target distribution
  const distribution = {
    Algebra: Math.round(total * 0.3),
    Trigonometry: Math.round(total * 0.4),
    "Profit & Loss": Math.round(total * 0.3),
  };

  try {
    let questions = [];

    for (const [category, count] of Object.entries(distribution)) {
      // Count available questions in this category
      const availableCount = await Question.countDocuments({ category, active: true });
      const sampleSize = Math.min(count, availableCount);

      if (sampleSize > 0) {
        const categoryQuestions = await Question.aggregate([
          { $match: { category, active: true } },
          { $sample: { size: sampleSize } },
        ]);
        questions = questions.concat(categoryQuestions);
      }
    }

    return res.json({ questions, total: questions.length });
  } catch (err) {
    console.error("❌ Quiz API Error:", err);
    return res.status(500).json({ error: "Server error fetching questions" });
  }
});

module.exports = router;
