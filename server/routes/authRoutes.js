import express from 'express';
import { registerUser, loginUser, getUsers, updateUser, deleteUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  verifyOTP,
  resendOTP
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/profile/:id', getUserProfile);

router.route('/users').get(protect, getUsers);
router.route('/users/:id').put(protect, updateUser);
router.route('/users/:id').delete(protect, deleteUser);

export default router;
