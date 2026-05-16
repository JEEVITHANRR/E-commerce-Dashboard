import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const generateTokens = (userId: string) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret', { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ name, email, password });
        await user.save();

        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        res.status(201).json({ accessToken, refreshToken, user: { id: user._id, name, email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user: any = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        res.json({ accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

    try {
        const payload: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret');
        const accessToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
        res.json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};
