/**
 * @desc    Global error handling middleware for Express applications.
 *          Catches errors passed via `next(err)` or unhandled exceptions in async routes.
 * @param   {object} err - The error object caught by Express.
 * @param   {object} req - Express request object
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware function (unused in a global handler)
 */
module.exports = (err, req, res, next) => {
  // Log the full error to the server console for debugging purposes
  console.error(err);

  // Determine the HTTP status code: use the error's status code if available, otherwise default to 500 (Internal Server Error)
  const status = err.statusCode || 500;
  
  // Send the appropriate status code and a JSON response with the error message
  res.status(status).json({ 
    message: err.message || 'Internal Server Error' 
  });
};
