const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Joi = require('joi');


const registerSchema = Joi.object({ name: Joi.string().required(), email: Joi.string().email().required(), password: Joi.string().min(6).required() });
const loginSchema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });


function signToken(user){
return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}


exports.register = async (req, res) => {
const { error, value } = registerSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.message });
const exists = await User.findOne({ email: value.email });
if (exists) return res.status(409).json({ message: 'Email already in use' });
const user = await User.create(value);
const token = signToken(user);
res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};


exports.login = async (req, res) => {
const { error, value } = loginSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.message });
const user = await User.findOne({ email: value.email }).select('+password');
if (!user) return res.status(401).json({ message: 'Invalid credentials' });
const match = await user.comparePassword(value.password);
if (!match) return res.status(401).json({ message: 'Invalid credentials' });
const token = signToken(user);
res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};