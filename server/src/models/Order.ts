import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Shipped', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
