import express from 'express';
import { registerAdmin, login, logout, getCurrentUser } from '../controller/AuthController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

// Public routes (NO authentication middleware)
authRouter.post('/register', registerAdmin);  // ← This should be public
authRouter.post('/login', login);             // ← This should be public

// Protected routes (WITH authentication middleware)
authRouter.post('/logout', authenticateToken, logout);
authRouter.get('/me', authenticateToken, getCurrentUser);

export default authRouter;
