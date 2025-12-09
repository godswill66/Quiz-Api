const mongoose = require('mongoose');


/**
 * Connects to the MongoDB database using the URI from environment variables.
 * Exits the process if the URI is missing or the connection fails.
 */

const connectDB = async (uri) => {
try {
await mongoose.connect(uri, {
useNewUrlParser: true,
useUnifiedTopology: true,
});
console.log('MongoDB connected successfully');
} catch (err) {
console.error('MongoDB connection error', err.message);
process.exit(1);
}
};


module.exports = connectDB;