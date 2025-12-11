require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// --- CRITICAL: Add middleware BEFORE your routes ---
// Parse incoming JSON payloads (required for POST/PUT requests)
app.use(express.json());

// Connect to MongoDB
console.log("Mongo URI being used:", process.env.MONGO_URI); // ADD THIS LINE

mongoose
  .connect(process.env.MONGO_URI) // Use MONGO_URI to match your .env file
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

// --- Define all your routes ---
// Use paths relative to the server.js file location (within the 'src' folder)

// Note: I corrected the paths from `../src/routes/quizzes` to `./routes/quizzes` 
// assuming server.js is inside the src folder.

app.use("/api/results", require("./routes/results"));
app.use("/api/answer", require("./routes/answer"));
app.use("/api/questions", require("./routes/questions"));

const quizRoutes = require("./routes/quizzes");
app.use("/api/quizzes", quizRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Test protected route
const auth = require("./middleware/auth");
app.get("/api/protected", auth, (req, res) => {
  res.json({ message: "You are authenticated!", user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
