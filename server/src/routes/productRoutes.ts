import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getProducts);
router.post('/', auth, createProduct);
router.patch('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

export default router;
