const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Otp = require('../models/Otp');
const sendEmail = require('../utils/sendEmail');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const sendRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a secure 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any existing OTP for this email to prevent spam/conflicts
    await Otp.deleteMany({ email });

    // Save to Otp collection
    await Otp.create({
      email,
      otp,
    });

    const message = `Welcome to DriveDeal! Your registration OTP is \n\n ${otp} \n\n This code is strictly valid for 5 minutes.`;
    
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to DriveDeal!</h2>
        <p>We are excited to have you join us.</p>
        <p>Your one-time registration verification code is:</p>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 4px; border-radius: 8px; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #64748b; font-size: 14px;">This code will automatically expire in exactly 5 minutes.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: email,
        subject: 'DriveDeal - Your Registration Code',
        message,
        htmlMessage
      });

      res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
      console.error(err);
      await Otp.deleteMany({ email }); // rollback if email delivery fails
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: 'Please add all fields including the OTP' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Verify OTP
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // Default to user unless specified
    });

    if (user) {
      // Burn the OTP so it can never be reused
      await Otp.deleteMany({ email });
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    // Verify password
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url (this should match the frontend route)
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendURL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    
    const htmlMessage = `
      <h3>Password Reset Request</h3>
      <p>You requested a password reset. Please click the link below to set a new password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password Link</a>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'DriveDeal Password Reset',
        message,
        htmlMessage
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token or token has expired' });
    }

    if (!req.body.password) {
       return res.status(400).json({ message: 'Please provide a new password' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { email, name, googleId, picture, isSignup } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ message: 'Missing Google account information' });
    }

    // Find existing user by email
    let user = await User.findOne({ email });

    if (user) {
      // Signup attempt but account already exists
      if (isSignup) {
        return res.status(400).json({
          message: 'An account with this email already exists. Please sign in instead.',
        });
      }
      // Login: link googleId if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save({ validateBeforeSave: false });
      }
    } else {
      // Login attempt but no account found
      if (!isSignup) {
        return res.status(404).json({
          message: 'No account found with this email. Please sign up first.',
        });
      }
      // Signup: create a new Google user (no password needed)
      user = await User.create({
        name,
        email,
        googleId,
        role: 'user',
      });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });

  }
};


module.exports = {
  sendRegistrationOtp,
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  googleAuth,
};

