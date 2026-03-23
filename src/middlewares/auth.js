const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
    const authHeader = req.headers.authorization;
    // Expect: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: token missing' });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decoded; // { id, email, iat, exp }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: invalid or expired token' });
    }
}
module.exports = auth;