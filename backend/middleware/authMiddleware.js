import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decodes token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwellsecretjwt');

      // Attach user credentials to the request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      };

      return next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ error: 'Not authorized, token verification failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }
};

export { protect };
