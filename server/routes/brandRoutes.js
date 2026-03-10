import express from 'express';
import { getBrands, addBrand, deleteBrand } from '../controllers/brandController.js';
import { protect } from '../middleware/authMiddleware.js'; // Assuming you have auth middleware

const router = express.Router();

router.get('/', getBrands);
router.post('/', protect, addBrand);
router.delete('/:id', protect, deleteBrand);

export default router;
