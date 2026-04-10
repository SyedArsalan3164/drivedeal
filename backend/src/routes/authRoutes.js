const express = require('express');
const router = express.Router();
const {
  sendRegistrationOtp,
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/send-otp', authLimiter, sendRegistrationOtp);
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/me', protect, getMe);
router.post('/forgotpassword', authLimiter, forgotPassword);
router.put('/resetpassword/:resettoken', authLimiter, resetPassword);

module.exports = router;
