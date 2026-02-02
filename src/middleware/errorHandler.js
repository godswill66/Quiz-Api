// src/middleware/errorHandler.js
module.exports = (err, req, res, next) => { // Ensure 'next' is present here!
  console.error("--- ERROR LOG ---");
  console.error(err); 

  const status = err.statusCode || 500;
  
  // Use return to ensure the function stops here
  return res.status(status).json({ 
    message: err.message || 'Internal Server Error',
    stack: err.stack ? err.stack.split('\n') : "Stack trace unavailable"
  });
};