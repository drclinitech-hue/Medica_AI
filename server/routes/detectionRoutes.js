const express = require('express');
const router = express.Router();
const {
  startDetection,
  analyzeDescription,
  runDetection,
  getDetectionHistory,
  getDetectionReport
} = require('../controllers/detectionController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/start', protect, startDetection);
router.post('/analyze', protect, analyzeDescription);
router.post('/detect', protect, runDetection);
router.get('/history', protect, getDetectionHistory);
router.get('/report/:id', protect, getDetectionReport);

module.exports = router;
