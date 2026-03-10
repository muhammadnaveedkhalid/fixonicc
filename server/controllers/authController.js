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

// Nice HTML for OTP verification email (matches email-templates/verify-email-otp.html)
const getVerifyEmailHtml = (otp) => `
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
<p style="color:#334155;font-size:16px;line-height:1.6;margin:0 0 24px 0;">Use this code to verify your Fixonic account:</p>
<p style="text-align:center;margin:0 0 24px 0;">
<span style="display:inline-block;background:#f1f5f9;color:#0A192F;font-weight:700;font-size:28px;letter-spacing:8px;padding:16px 24px;border-radius:14px;border:2px solid #e2e8f0;">${otp}</span>
</p>
<p style="color:#64748b;font-size:13px;line-height:1.5;margin:0;">This code expires in 10 minutes. If you didn't request it, you can ignore this email.</p>
</td></tr>
<tr><td style="padding:20px 28px;border-top:1px solid #f1f5f9;">
<p style="color:#94a3b8;font-size:12px;margin:0;text-align:center;">Fixonic – Device repair & services</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      if (!userExists.isEmailVerified) {
          // Resend OTP if user exists but not verified
          const emailOtp = generateOTP();
          const phoneOtp = generateOTP();
          const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

          userExists.emailOtp = emailOtp;
          userExists.phoneOtp = phoneOtp;
          userExists.otpExpires = otpExpires;
          userExists.name = name;
          userExists.password = password;
          userExists.role = role;
          userExists.phoneNumber = phoneNumber;
          await userExists.save();

          // Send Email OTP
          await sendEmail(
              email,
              'Verify your Email - Fixonic',
              `Your Email Verification OTP is: ${emailOtp}`,
              getVerifyEmailHtml(emailOtp)
          );
          
          return res.status(200).json({ 
              message: 'User already exists but not verified. OTP resent.',
              userId: userExists._id,
              requireVerification: true 
            });
      }
      return res.status(400).json({ message: 'User already exists' });
    }

    const emailOtp = generateOTP();
    const phoneOtp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.create({
      name,
      email,
      password,
      role,
      phoneNumber,
      emailOtp,
      phoneOtp,
      otpExpires,
      status: role === 'vendor' ? 'pending' : 'active',
      isEmailVerified: false,
      isPhoneVerified: false
    });

    if (user) {
         // Send Email OTP
         await sendEmail(
            email,
            'Verify your Email - Fixonic',
            `Your Email Verification OTP is: ${emailOtp}`,
            getVerifyEmailHtml(emailOtp)
        );

        res.status(201).json({
           message: 'Registration successful. Please verify your email and phone.',
           userId: user._id,
           requireVerification: true
        });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify
// @access  Public
export const verifyOTP = async (req, res, next) => {
    try {
        const { userId, emailOtp, phoneOtp } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired. Please register again.' });
        }

        let isVerified = false;

        if (emailOtp && user.emailOtp === emailOtp) {
            user.isEmailVerified = true;
            user.emailOtp = undefined;
            isVerified = true;
        }

        if (phoneOtp && user.phoneOtp === phoneOtp) {
            user.isPhoneVerified = true;
            user.phoneOtp = undefined;
            // Combined verification logic if needed
        }

        if(isVerified) {
             user.otpExpires = undefined;
             await user.save();

             if (user.status === 'pending' && user.role === 'vendor') {
                 return res.json({
                    message: 'Verification successful. Account pending admin approval.',
                    status: 'pending'
                 });
             }
             return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                token: generateToken(user._id),
             });
        }
        return res.status(400).json({ message: 'Invalid OTP' });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Resend OTP to unverified user
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        const emailOtp = generateOTP();
        const phoneOtp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        user.emailOtp = emailOtp;
        user.phoneOtp = phoneOtp;
        user.otpExpires = otpExpires;
        await user.save();

        await sendEmail(
            user.email,
            'Verify your Email - Fixonic',
            `Your Email Verification OTP is: ${emailOtp}`,
            getVerifyEmailHtml(emailOtp)
        );

        return res.status(200).json({ message: 'Verification code sent again to your email.' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        return res.status(500).json({ message: error.message || 'Failed to resend code' });
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
      if (!user.isEmailVerified) {
          return res.status(401).json({ 
              message: 'Email not verified. Please verify your email.',
              userId: user._id,
              requireVerification: true
            });
      }

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
