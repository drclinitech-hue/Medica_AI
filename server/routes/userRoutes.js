const express = require('express');
const router = express.Router();
const { getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/profile', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
