import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../postgres/postgres.js';
import { Op } from 'sequelize';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';
const JWT_EXPIRES_IN = '24h';

// Register admin
export const registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ 
                error: "Username, email, and password are required" 
            });
        }

        // Check if admin already exists
        const existingAdmin = await AdminModel.findOne({ 
            where: { 
                [Op.or]: [{ email }, { username }]
            } 
        });

        if (existingAdmin) {
            return res.status(400).json({ 
                error: "Admin with this email or username already exists" 
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create admin
        const admin = await AdminModel.create({
            username,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        // Remove password from response
        const { password: _, ...adminData } = admin.toJSON();

        return res.status(201).json({
            message: "Admin registered successfully",
            admin: adminData
        });

    } catch (error) {
        console.error('Error in registerAdmin:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                error: "Email and password are required" 
            });
        }

        // Find admin by email
        const admin = await AdminModel.findOne({ where: { email } });

        if (!admin) {
            return res.status(401).json({ 
                error: "Invalid email or password" 
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: "Invalid email or password" 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: admin.id, 
                email: admin.email, 
                username: admin.username,
                role: admin.role 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Set HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Remove password from response
        const { password: _, ...adminData } = admin.toJSON();

        return res.status(200).json({
            message: "Login successful",
            admin: adminData,
            token
        });

    } catch (error) {
        console.error('Error in login:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('authToken');
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error('Error in logout:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Verify token and get current user
export const getCurrentUser = async (req, res) => {
    try {
        const { password: _, ...adminData } = req.user.toJSON();
        return res.status(200).json({ user: adminData });
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
