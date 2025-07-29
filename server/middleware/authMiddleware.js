import jwt from 'jsonwebtoken';
import { AdminModel } from '../postgres/postgres.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';

export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies?.authToken || req.headers?.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: "Access token required" });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user from database
        const admin = await AdminModel.findByPk(decoded.id);

        if (!admin) {
            return res.status(401).json({ error: "Invalid token" });
        }

        req.user = admin;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        }
        
        console.error('Error in authenticateToken:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
