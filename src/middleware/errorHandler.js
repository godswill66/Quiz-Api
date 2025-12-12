// src/middleware/errorHandler.js (Modified to force message display)


module.exports = (err, req, res, next) => {
  // Log the full error to the server console for debugging purposes
  console.error(err); 

  // Ensure the status code is set correctly
  const status = err.statusCode || 500;
  res.status(status);
  
  // Send the message and force the stack trace into the response body regardless of NODE_ENV
  res.json({ 
    message: err.message || 'Internal Server Error',
    stack: err.stack ? err.stack.split('\n') : "Stack trace unavailable"
  });
};
