const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Keep select: false for security
  password: { type: String, required: true, select: false }, 
});

// IMPROVED PRE-SAVE HOOK
userSchema.pre("save", async function () {
  // If password isn't changed, just stop
  if (!this.isModified("password")) return;
  
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  
  // Hash the password
  this.password = await bcrypt.hash(this.password, rounds);
  
  // NOTE: In async hooks, you don't strictly need next() 
  // but removing it prevents the "next is not a function" error 
  // if Mongoose is misconfigured.
});

// IMPROVED LOGIN METHOD
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Since password is 'select: false', we must ensure it exists here
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);