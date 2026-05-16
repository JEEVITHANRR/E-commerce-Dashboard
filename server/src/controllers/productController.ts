import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;
        const query: any = {};
        
        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const products = await Product.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(query);

        res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const seedProducts = async (req: any, res: any) => {
    try {
        await Product.deleteMany({});
        const demoProducts = [
            { name: "Pro Studio Headphones", price: 299, category: "Electronics", stock: 45, status: "active" },
            { name: "Minimalist Leather Bag", price: 150, category: "Fashion", stock: 30, status: "active" },
            { name: "Ergonomic Desk Chair", price: 450, category: "Home", stock: 12, status: "active" },
            { name: "Wireless Mechanical Keyboard", price: 180, category: "Electronics", stock: 55, status: "active" },
            { name: "Silk Sleeping Mask", price: 35, category: "Beauty", stock: 100, status: "active" }
        ];
        await Product.insertMany(demoProducts);
        res.json({ message: "Database seeded successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Seeding failed" });
    }
};
