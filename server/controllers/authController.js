import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/notificationService.js';
import crypto from 'crypto';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// HTML for email verification link
const getVerifyEmailLinkHtml = (verifyUrl) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Verify your email – Fixonic</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',system-ui,sans-serif;background:#f1f5f9;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:24px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:420px;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(10,25,47,0.08);">
<tr><td style="background:#0A192F;padding:28px 32px;text-align:center;">
<span style="display:inline-block;background:#99FF00;color:#0A192F;font-weight:800;font-size:18px;padding:8px 14px;border-radius:12px;">Fixonic</span>
<p style="color:rgba(255,255,255,0.85);font-size:14px;margin:12px 0 0 0;">Verify your email</p>
</td></tr>
<tr><td style="padding:32px 28px;">
<p style="color:#334155;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Hi there,</p>
<p style="color:#334155;font-size:16px;line-height:1.6;margin:0 0 24px 0;">Click the button below to verify your Fixonic account:</p>
<p style="text-align:center;margin:0 0 24px 0;">
  <a href="${verifyUrl}" style="display:inline-block;background:#99FF00;color:#0A192F;font-weight:800;font-size:15px;letter-spacing:0.08em;padding:14px 26px;border-radius:999px;text-decoration:none;text-transform:uppercase;">Verify Email</a>
</p>
<p style="color:#64748b;font-size:13px;line-height:1.5;margin:0;">If you didn't create a Fixonic account, you can safely ignore this email.</p>
</td></tr>
<tr><td style="padding:20px 28px;border-top:1px solid #f1f5f9;">
<p style="color:#94a3b8;font-size:12px;margin:0;text-align:center;">Fixonic – Device repair & services</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

// @desc    Register new user (no email verification – can login right away)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phoneNumber,
      status: role === 'vendor' ? 'pending' : 'active',
      isEmailVerified: true,
      isPhoneVerified: false,
    });

    if (user) {
      res.status(201).json({
        message: 'Registration successful. You can sign in now.',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify email via magic link
// @route   GET /api/auth/verify-email?token=...
// @access  Public
export const verifyEmailLink = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ message: 'Verification token is required' });
        }

        const user = await User.findOne({
          emailVerifyToken: token,
          emailVerifyExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification link' });
        }

        user.isEmailVerified = true;
        user.emailVerifyToken = undefined;
        user.emailVerifyExpires = undefined;
        await user.save();

        if (user.status === 'pending' && user.role === 'vendor') {
            return res.json({
                message: 'Email verified successfully. Account pending admin approval.',
                status: 'pending',
            });
        }

        return res.json({
            message: 'Email verified successfully.',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('verifyEmailLink error:', error.message || error);
        return res.status(500).json({ message: 'Server error while verifying email. Please try again.' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.status !== 'active') {
        let message = 'Account is pending approval or inactive.';
        if (user.status === 'rejected') {
          message = `Account Rejected. Reason: ${user.rejectionReason || 'No reason provided.'}`;
        } else if (user.status === 'pending') {
          message = 'Account is pending administrator approval.';
        }
        return res.status(403).json({ message });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ... existing code ...

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';

    let query = {};
    // If the requesting user is not an admin, only return vendors
    if (req.user && req.user.role !== 'admin') {
      query = { role: 'vendor' };
    } else {
      // If admin, handle filtering
      if (req.query.role) {
        query.role = req.query.role;
      } else {
        query.role = { $ne: 'admin' };
      }
      
      if (req.query.status) {
        query.status = req.query.status;
      }
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      if (query.role) {
         // If role is already set, we need to respect it and add search conditions
         query.$and = [
           { role: query.role },
           {
             $or: [
               { name: searchRegex },
               { email: searchRegex }
             ]
           }
         ];
         delete query.role; // clean up since it's in $and
      } else {
         query.$or = [
           { name: searchRegex },
           { email: searchRegex }
         ];
      }
    }

    const count = await User.countDocuments(query);
    const users = await User.find(query)
      .limit(limit)
      .skip(limit * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      users,
      page,
      pages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.status = req.body.status || user.status; 
      
      if (req.body.rejectionReason) user.rejectionReason = req.body.rejectionReason;
      
      // Profile Updates
      if (req.body.bio !== undefined) user.bio = req.body.bio;
      if (req.body.banner !== undefined) user.banner = req.body.banner;
      if (req.body.specialties !== undefined) user.specialties = req.body.specialties;
      if (req.body.profileImage !== undefined) user.profileImage = req.body.profileImage;

      if (req.body.password) {
        // Password hashing is handled in User model pre-save middleware
        user.password = req.body.password; 
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        bio: updatedUser.bio,
        banner: updatedUser.banner,
        specialties: updatedUser.specialties,
        profileImage: updatedUser.profileImage,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve vendor (no middleware – auth done here to avoid serverless "next is not a function")
// @route   POST /api/auth/users/:id/approve
// @access  Private/Admin
export const approveVendor = async (req, res) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminUser = await User.findById(decoded.id).select('-password');
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized as admin' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = 'active';
    if (user.rejectionReason) user.rejectionReason = undefined;
    const updated = await user.save();
    return res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      status: updated.status,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Not authorized' });
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Reject vendor (no middleware – auth done here)
// @route   POST /api/auth/users/:id/reject
// @access  Private/Admin
export const rejectVendor = async (req, res) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminUser = await User.findById(decoded.id).select('-password');
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized as admin' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = 'rejected';
    if (req.body.rejectionReason) user.rejectionReason = req.body.rejectionReason;
    const updated = await user.save();
    return res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      status: updated.status,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Not authorized' });
    console.error(error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get user profile (public)
// @route   GET /api/auth/profile/:id
// @access  Public
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Forgot Password - Verify email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // In a real app, generate token and send email
    // For this task, we just confirm existence
    res.json({ message: 'Email verified', email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password; // Will be hashed by pre-save hook
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
