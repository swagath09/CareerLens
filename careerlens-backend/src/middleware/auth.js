const { getAuth } = require('../config/firebase');

/**
 * Middleware: Verifies Firebase ID token from Authorization header.
 * Attaches decoded user to req.user.
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: No token provided',
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || null,
      picture: decodedToken.picture || null,
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired token',
    });
  }
};

module.exports = { verifyToken };
