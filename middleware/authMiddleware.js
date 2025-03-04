const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log("token");
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded");
        console.log(decoded);
        const user = await User.findById(decoded.id);
        console.log("user");
        console.log(user);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = { authMiddleware };
