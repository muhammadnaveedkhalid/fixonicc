import express from 'express';
import { registerUser, loginUser, getUsers, updateUser, deleteUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  verifyEmailLink
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Removed asyncHandler from all routes to fix "next is not a function" on Vercel serverless
// All controllers already have proper try/catch error handling
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email', verifyEmailLink);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/profile/:id', getUserProfile);

router.route('/users').get(protect, getUsers);
router.route('/users/:id').put(protect, admin, updateUser);
router.route('/users/:id').delete(protect, admin, deleteUser);

export default router;
