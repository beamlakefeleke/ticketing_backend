const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log("Token:", token);
        
        if (!token) {
            console.log("No token provided");
            return res.status(401).json({ error: 'Unauthorized, token is missing' });
        }

        // Verify token validity using JWT Secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);

        // Fetch user associated with the token ID
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ error: 'User not found' });
        }

        // Attach the user object to the request
        req.user = user;
        next(); // Allow the request to proceed to the next middleware or route handler
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Session expired. Please log in again.' });
        }
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = { authMiddleware };
