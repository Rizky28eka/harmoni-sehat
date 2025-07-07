const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded payload to req.user
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token kedaluwarsa. Silakan login kembali.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Token tidak valid. Silakan login kembali.' });
        } else {
            return res.status(500).json({ success: false, message: 'Gagal mengautentikasi token.' });
        }
    }
};

module.exports = authMiddleware;