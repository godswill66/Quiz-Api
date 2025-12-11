// Load environment variables from the .env file immediately upon starting the app
require("dotenv").config(); 

// Import the Express framework
const express = require("express");
// Import the Mongoose library for MongoDB interaction
const mongoose = require("mongoose");
// Create the Express application instance
const app = express();

/* --- Core Middleware --- */

// Parse incoming JSON payloads from request bodies (e.g., POST, PUT requests)
app.use(express.json());

/* --- Database Connection --- */

// Log the URI being used for debugging purposes (can be removed later)
console.log("Mongo URI being used:", process.env.MONGO_URI);

// Connect to the MongoDB database using the URI from environment variables
mongoose
  .connect(process.env.MONGO_URI) 
  .then(() => console.log("MongoDB connected successfully")) // Log success
  .catch((err) => console.log("Mongo error:", err)); // Log connection errors

/* --- Route Definitions --- */

// Define application routes, using paths relative to the server.js file's location

// Results routes
app.use("/api/results", require("./routes/results"));
// Answer routes
app.use("/api/answer", require("./routes/answer"));
// Question routes
app.use("/api/questions", require("./routes/questions"));

// Quiz routes
const quizRoutes = require("./routes/quizzes");
app.use("/api/quizzes", quizRoutes);

// Authentication routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Test protected route example: demonstrates using the 'auth' middleware
const auth = require("./middleware/auth");
app.get("/api/protected", auth, (req, res) => {
  res.json({ message: "You are authenticated!", user: req.user });
});

/* --- Server Initialization --- */

// Set the port number from environment variables, defaulting to 3000
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming network requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
