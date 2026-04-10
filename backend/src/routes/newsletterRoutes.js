const express = require('express');
const router = express.Router();
const { subscribeNewsletter, unsubscribeNewsletter } = require('../controllers/newsletterController');
const { formLimiter } = require('../middleware/rateLimiter');

// Public route to subscribe to the newsletter
router.post('/subscribe', formLimiter, subscribeNewsletter);

// Public route to unsubscribe from the newsletter via email link
router.get('/unsubscribe', unsubscribeNewsletter);

module.exports = router;
