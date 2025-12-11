const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using the provided connection URI.
 * This function utilizes async/await for cleaner asynchronous handling.
 * 
 * @param {string} uri - The MongoDB connection string (e.g., from process.env.MONGO_URI).
 */
const connectDB = async (uri) => {
  try {
    // Attempt to connect to the MongoDB cluster using Mongoose's connect method
    await mongoose.connect(uri, {
      // Use new MongoDB connection string parser to avoid deprecation warnings
      useNewUrlParser: true,
      // Use the new server discovery and monitoring engine
      useUnifiedTopology: true,
    });
    
    // Log success message upon successful connection
    console.log('MongoDB connected successfully');

  } catch (err) {
    // Log error details if the connection fails
    console.error('MongoDB connection error:', err.message);
    
    // Exit the process with a failure code (1) to indicate a critical error
    process.exit(1);
  }
};

/**
 * Exports the connectDB function to be used in the main server file (e.g., server.js).
 */
module.exports = connectDB;
