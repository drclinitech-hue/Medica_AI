const express = require('express');
const router = express.Router();
const { 
  getDoctors, 
  getDoctorById, 
  getRecommendedDoctors, 
  getMyDoctorProfile 
} = require('../controllers/doctorController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getDoctors);
router.post('/recommend', getRecommendedDoctors);
router.get('/profile/me', protect, getMyDoctorProfile);
router.get('/:id', getDoctorById);

module.exports = router;
