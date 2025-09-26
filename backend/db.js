const mongoose = require('mongoose');
   require('dotenv').config();

   const connectDB = async () => {
     await mongoose.connect(process.env.MONGODB_URI);
     console.log('MongoDB connected');
   };

   const closeDB = async () => {
     await mongoose.connection.close();
     console.log('MongoDB connection closed');
   };

   module.exports = { connectDB, closeDB };