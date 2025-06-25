const jwt = require('jsonwebtoken');

// 1. Generate token (no expiration)
const generateToken = (userData) => {
    return jwt.sign({userData}, process.env.JWT_SECRET, {expiresIn:400000000});
};

// 2. Auth middleware
const jwtAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Invalid token format' });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { generateToken, jwtAuthMiddleware };