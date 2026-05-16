import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Import routes and middleware from the server directory
// Note: We keep the logic in /server but point Vercel to /api
import authRoutes from '../server/src/routes/authRoutes';
import productRoutes from '../server/src/routes/productRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));

// Connect to MongoDB
const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'API is healthy', timestamp: new Date() });
});

// Middleware to connect DB on every request for serverless
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

export default app;
