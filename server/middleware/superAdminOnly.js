const superAdminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'superadmin') {
        return res.status(403).json({ error: 'Access denied: Super Admins only' });
    }
    next();
};

module.exports = superAdminOnly;
