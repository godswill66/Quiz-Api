const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') }); 

const express = require("express"); // Only ONE of these!
const mongoose = require("mongoose");
const app = express();
// ... continue with the rest
// Import the centralized DB connection function
const connectDB = require('./config/db'); 
// Import the error handler middleware
const errorHandler = require("./middleware/errorHandler.js"); 
// Import the authentication middleware (renamed file/variable)
const authMiddleware = require("./middleware/authMiddleware.js"); 

/* --- Core Middleware --- */

// Parse incoming JSON payloads from request bodies (e.g., POST/PUT requests)
app.use(express.json());

/* --- Database Connection --- */

console.log("Mongo URI being used:", process.env.MONGO_URI);
connectDB(process.env.MONGO_URI); // Use the dedicated connection function

/* --- Route Definitions --- */

// Define application routes, using paths relative to the server.js file's location (within src)
/* --- Route Definitions --- */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/quizzes", require("./routes/quizzes"));
app.use("/api/results", require("./routes/results"));


const quizRoutes = require("./routes/quizzes");
app.use("/api/quizzes", quizRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// This line makes http://localhost:3001/api/ID/answers possible
app.use("/api", require("./routes/questions"));

// Test protected route example: demonstrates using the 'authMiddleware'
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authenticated!", user: req.user });
});

/* --- Error Handler (Must be last) --- */

// Mount the error handler as the last piece of middleware that handles errors
app.use(errorHandler); 

/* --- Server Initialization --- */

// Set the port number from environment variables, defaulting to 3000
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming network requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
