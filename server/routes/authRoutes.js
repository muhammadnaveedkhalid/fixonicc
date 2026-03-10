import express from 'express';
import { registerUser, loginUser, getUsers, updateUser, deleteUser,
  approveVendor,
  rejectVendor,
  forgotPassword,
  resetPassword,
  getUserProfile,
  verifyEmailLink
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Wrap async controllers so errors are passed to Express error handler and "next" is never called when undefined (Vercel serverless)
const runAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res)).catch((err) => {
    if (typeof next === 'function') next(err);
    else res.status(500).json({ message: err.message || 'Server error' });
  });
};

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email', verifyEmailLink);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/profile/:id', getUserProfile);

router.route('/users').get(protect, runAsync(getUsers));
// Dedicated approve/reject (no middleware chain – auth inside handler to avoid serverless "next is not a function")
router.post('/users/:id/approve', approveVendor);
router.post('/users/:id/reject', rejectVendor);
router.route('/users/:id').put(protect, admin, runAsync(updateUser));
router.route('/users/:id').delete(protect, admin, runAsync(deleteUser));

export default router;
