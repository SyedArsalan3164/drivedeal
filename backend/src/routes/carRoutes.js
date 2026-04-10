const express = require('express');
const router = express.Router();
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
} = require('../controllers/carController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/').get(getCars);
router.route('/:id').get(getCarById);

// Admin-only routes
router.route('/').post(protect, admin, createCar);
router.route('/:id').put(protect, admin, updateCar).delete(protect, admin, deleteCar);

module.exports = router;
