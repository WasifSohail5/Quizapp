// backend/utils/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE || "true") === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendResultMail({ participant }) {
  const { teamName, participantId, grade, score } = participant;
  const to = process.env.INSTRUCTOR_EMAIL || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"MathChrono Quiz" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Quiz Result - ${teamName}`,
    html: `
      <h2>Quiz Result Submitted</h2>
      <p><strong>Team Name:</strong> ${teamName}</p>
      <p><strong>Participant ID:</strong> ${participantId}</p>
      <p><strong>Grade:</strong> ${grade}</p>
      <p><strong>Score:</strong> ${score}</p>
      <p><em>Submitted on ${new Date().toLocaleString()}</em></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${mailOptions.to}`);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
}

module.exports = { sendResultMail };
