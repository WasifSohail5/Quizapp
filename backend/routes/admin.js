const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const Question = require("../models/Question");
const User = require("../models/User");

const router = express.Router();

// Get all questions
router.get("/questions", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a question
router.post("/questions", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ message: "Invalid question data" });
  }
});

// Update a question
router.put(
  "/questions/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const question = await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(question);
    } catch (err) {
      res.status(400).json({ message: "Invalid question data" });
    }
  }
);

// Delete a question
router.delete(
  "/questions/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const question = await Question.findByIdAndDelete(req.params.id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json({ message: "Question deleted" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all users
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a user
router.post("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, grade, email, password } = req.body;
    const user = new User({
      name,
      grade,
      email,
      password: password,
      participantId: `PART_${Date.now()}`,
      isAdmin: false,
    });
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid user data" });
  }
});

// Delete a user
router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get analytics
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const numParticipants = await User.countDocuments({ isAdmin: false });
    const numSubmissions = await Question.countDocuments(); // Adjust based on actual submission data
    const averageScore = 0; // Placeholder; implement actual logic if needed
    const questionsPerGrade = await Question.aggregate([
      { $group: { _id: "$grade", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({
      numParticipants,
      numSubmissions,
      averageScore,
      questionsPerGrade,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
