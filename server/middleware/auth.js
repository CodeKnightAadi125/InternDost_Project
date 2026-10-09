const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Check if there is an authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    // Extract the token (Expected format: "Bearer <token>")
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Invalid token format, authorization denied' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the user payload to the request object
        req.user = decoded;
        next(); // Proceed to the next function/route
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
