// Import the Mongoose library for schema and model creation
const mongoose = require("mongoose");
// Import bcryptjs for password hashing and comparison
const bcrypt = require("bcryptjs");

/**
 * @desc    Defines the schema for the User model.
 */
const userSchema = new mongoose.Schema({
  // User's name (required)
  name: { type: String, required: true },
  // User's email (required, must be unique in the database)
  email: { type: String, required: true, unique: true },
  // User's password (required). 'select: false' prevents Mongoose from returning 
  // this field by default in queries (security best practice).
  password: { type: String, required: true, select: false },
  // Note: A 'role' field could be added here for the RBAC middleware if needed.
});

/**
 * @desc    Mongoose Pre-Save Hook: Hashes the password before saving the user document.
 *          Runs whenever a user is created or updated, but only if the password field is modified.
 */
userSchema.pre("save", async function (next) {
  // Check if the password field has been modified; if not, skip hashing
  if (!this.isModified("password")) return next();
  
  // Determine salt rounds from environment variable or default to 10
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  
  // Hash the password using the generated salt rounds
  this.password = await bcrypt.hash(this.password, rounds);
  
  // Continue with the save operation
  next();
});

/**
 * @desc    Mongoose Schema Method: Compares a given plain-text password with the stored hashed password.
 * @param   {string} password - The plain-text password provided during login.
 * @returns {Promise<boolean>} True if passwords match, false otherwise.
 */
userSchema.methods.comparePassword = function (password) {
  // Uses bcrypt to compare the input password against the 'this.password' (hashed in the DB)
  return bcrypt.compare(password, this.password);
};

/**
 * @desc    Compiles and exports the User model.
 * @exports mongoose.Model<User>
 */
module.exports = mongoose.model("User", userSchema);
