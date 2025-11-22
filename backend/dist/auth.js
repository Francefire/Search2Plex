import jwt from 'jsonwebtoken';
export const requireAuth = async (req, res, next) => {
    try {
        const jwtSecret = process.env.SUPABASE_JWT_SECRET;
        if (!jwtSecret) {
            console.error('Missing SUPABASE_JWT_SECRET environment variable');
            return res.status(500).json({ error: 'Server configuration error' });
        }
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization header' });
        }
        const token = authHeader.split(' ')[1];
        // Verify the JWT token directly
        const decoded = jwt.verify(token, jwtSecret, {
            algorithms: ['HS256'] // Supabase uses HS256 for JWT signing
        });
        // Optional: Add additional validation
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ error: 'Token has expired' });
        }
        // Attach user information to request for downstream use
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        console.error('Auth error:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token has expired' });
        }
        res.status(500).json({ error: 'Authentication failed' });
    }
};
