

exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};