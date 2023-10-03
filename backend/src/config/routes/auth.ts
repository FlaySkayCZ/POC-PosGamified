// const jwt = require('jsonwebtoken');

// function checkRole(role) {
//   return (req, res, next) => {
//     // Get the JWT token from the Authorization header
//     const token = req.headers.authorization.split(' ')[1];

//     // Verify the token
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
      
//       // Check if the user has the required role
//       if (decoded.role !== role) {
//         return res.status(403).json({ message: 'Forbidden' });
//       }

//       // If the user has the required role, continue to the next middleware function
//       next();
//     });
//   };
// }

// module.exports = {
//   checkRole
// };
