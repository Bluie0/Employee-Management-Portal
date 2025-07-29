import 'dotenv/config';
import express from 'express';
import { connect } from './postgres/postgres.js';
import router from './view/routes.js';
import authRouter from './view/authRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express(); 

// CORS configuration - make sure both ports are allowed
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Both ports allowed
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Public auth routes FIRST (no authentication required)
app.use('/api/auth', authRouter);

// Protected employee routes SECOND (authentication required)
app.use('/api', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connect();
});
