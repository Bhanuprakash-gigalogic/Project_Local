const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // In a real app, you'd fetch the user from DB here to ensure they still exist
            req.user = { id: decoded.userId, role: decoded.role || 'user' };

            next();
        } catch (error) {
            console.error('Auth error:', error.message);
            res.status(401).json({ success: false, error: 'Not authorized, token failed' });
        }
    } else {
        // Check if route allows guest (optional logic, but here we just pass if not strict)
        // For this specific middleware, we assume strict protection.
        // Use a separate 'optionalAuth' middleware if needed.
        res.status(401).json({ success: false, error: 'Not authorized, no token' });
    }
};

exports.optionalAuth = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.userId, role: decoded.role };
        } catch (error) {
            // Invalid token but we proceed as guest
            console.log('Optional auth failed (proceeding as guest):', error.message);
        }
    }
    next();
};

exports.admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'agent')) {
        next();
    } else {
        res.status(403).json({ success: false, error: 'Not authorized as admin' });
    }
};
