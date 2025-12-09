const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
name: { type: String, required: true, trim: true },
email: { type: String, required: true, unique: true, lowercase: true },
password: { type: String, required: true, select: false },
role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });


userSchema.pre('save', async function (next) {
if (!this.isModified('password')) return next();
const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
this.password = await bcrypt.hash(this.password, saltRounds);
next();
});


userSchema.methods.comparePassword = async function (candidate) {
return bcrypt.compare(candidate, this.password);
};


module.exports = mongoose.model('User', userSchema);