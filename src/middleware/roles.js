/**
 * @desc    Middleware factory for role-based access control (RBAC).
 *          Checks if the authenticated user's role is included in the allowed roles list.
 * @param   {Array<string>} allowedRoles - An array of roles permitted to access the route (e.g., ['admin', 'editor']).
 * @returns {function} The actual Express middleware function (req, res, next).
 */
module.exports = function(allowedRoles = []) {
  // Return the actual middleware function that Express will execute
  return (req, res, next) => {
    // Check if the user object was populated by a preceding authentication middleware (like 'auth.js')
    if (!req.user) 
      return res.status(401).json({ message: 'Not authenticated: User information missing' });

    // Check if the user's role is present in the list of allowed roles
    if (!allowedRoles.includes(req.user.role)) 
      return res.status(403).json({ message: 'Forbidden: User role not authorized for this action' });
      
    // If authenticated and authorized, proceed to the next handler
    next();
  };
};
