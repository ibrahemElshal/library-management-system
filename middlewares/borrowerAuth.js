const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to authenticate requests using JWT.
 * Verifies the token and attaches the borrower payload to the request object.
 */
const authenticateBorrower = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.borrower = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateBorrower;
