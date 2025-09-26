const express = require("express");
const router = express.Router();
const Result = require("../models/Result");
const { sendResultMail } = require("../utils/mailer");

// Submit quiz result
router.post("/submit", async (req, res) => {
  try {
    const { participantId, teamName, grade, score } = req.body;

    if (!participantId || !teamName || !grade || score === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Save or update result (no duplicate error)
    const result = await Result.updateOne(
      { participantId }, // find by participantId
      { $set: { teamName, grade, score } }, // update these fields
      { upsert: true } // insert if not found
    );

    // ✅ Email instructor
    await sendResultMail({
      instructorEmail: process.env.INSTRUCTOR_EMAIL,
      participant: { participantId, teamName, grade, score },
    });

    res.json({ message: "Result submitted successfully", result });
  } catch (err) {
    console.error("❌ Result Submit Error:", err);
    res.status(500).json({ error: "Failed to submit result" });
  }
});

module.exports = router;
