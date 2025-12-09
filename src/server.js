require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');


const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quizzes');
const questionRoutes = require('./routes/questions');
const resultRoutes = require('./routes/results');


const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api', questionRoutes); // contains nested question and question-id routes
app.use('/api', resultRoutes);


app.get('/', (req, res) => res.json({ message: 'Quiz API' }));


app.use(errorHandler);


const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/quizdb')
.then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
.catch(err => console.error(err));