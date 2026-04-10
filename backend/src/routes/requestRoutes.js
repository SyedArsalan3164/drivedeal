const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect, admin } = require('../middleware/authMiddleware');
const { formLimiter } = require('../middleware/rateLimiter');

// Public route for creating requests
router.route('/').post(formLimiter, createRequest);

// Admin-only routes for managing requests
router.route('/').get(protect, admin, getRequests);
router.route('/:id/status').put(protect, admin, updateRequestStatus);

module.exports = router;
