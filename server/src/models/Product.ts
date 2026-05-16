import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    image: { type: String },
    status: { type: String, enum: ['active', 'out_of_stock', 'draft'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);
