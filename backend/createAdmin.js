const mongoose = require("mongoose");
const { connectDB, closeDB } = require("./db");
const User = require("./models/User");

async function createAdmin() {
  try {
    await connectDB();
    await User.deleteMany({ email: "admin@example.com" });
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    User.deleteMany({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }
    const admin = new User({
      name: "Admin",
      grade: 10, // Arbitrary, not used for admin
      email: "admin@example.com",
      password: "admin123",
      participantId: `ADMIN_${Date.now()}`,
      isAdmin: true,
    });
    await admin.save();
    console.log("Admin user created: admin@example.com / admin123");
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    await closeDB();
  }
}

createAdmin().catch(console.dir);
