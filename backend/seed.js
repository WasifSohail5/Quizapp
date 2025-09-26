const mongoose = require('mongoose');
const { connectDB, closeDB } = require('./db');
const questionsData = require('./questions.json'); // 30 questions file

async function seed() {
  try {
    await connectDB(); // Connect DB
    const db = mongoose.connection.db;
    const collection = db.collection('questions');

    // Drop old collection if exists
    const collections = await db.listCollections({ name: 'questions' }).toArray();
    if (collections.length > 0) {
      await collection.drop();
      console.log('Old questions collection dropped.');
    }

    // Insert new questions
    await collection.insertMany(questionsData);
    console.log(`✅ Database seeded with ${questionsData.length} questions`);

  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await closeDB();
  }
}

// Run directly
if (require.main === module) {
  console.log('🌱 Seeding database...');
  seed().catch(console.dir);
}
