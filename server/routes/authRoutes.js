import express from 'express';
import asyncHandler from 'express-async-handler';
import { registerUser, loginUser, getUsers, updateUser, deleteUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  verifyOTP,
  resendOTP
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
// verify OTP without asyncHandler to avoid "next is not a function" on Vercel serverless (app is invoked with req, res only)
router.post('/verify', verifyOTP);
router.post('/resend-otp', asyncHandler(resendOTP));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.post('/reset-password', asyncHandler(resetPassword));

router.get('/profile/:id', asyncHandler(getUserProfile));

router.route('/users').get(protect, getUsers);
router.route('/users/:id').put(protect, updateUser);
router.route('/users/:id').delete(protect, deleteUser);

export default router;
