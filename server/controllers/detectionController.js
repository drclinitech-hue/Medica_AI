const Detection = require('../models/Detection');
const groqService = require('../services/groqService');
const axios = require('axios');

// @desc    Start a new detection (Phase 1 & 2)
// @route   POST /api/detection/start
// @access  Private
const startDetection = async (req, res) => {
  try {
    const { demographics, medicalHistory } = req.body;
    
    // Create a draft detection
    const detection = await Detection.create({
      patientId: req.user._id,
      demographics,
      medicalHistory
    });

    res.status(201).json({ success: true, detectionId: detection._id, detection });
  } catch (error) {
    res.status(500).json({ message: 'Error starting detection', error: error.message });
  }
};

// @desc    Analyze health problem description with Groq (Phase 3 & 4)
// @route   POST /api/detection/analyze
// @access  Private
const analyzeDescription = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ message: 'Description is required' });

    // We can reuse groqService analyzeSymptoms by formatting the prompt slightly differently
    // Actually, groqService expects a chat history. We can just send a single user message.
    const history = [{ sender: 'user', text: description }];
    const aiResponse = await groqService.analyzeSymptoms(history);

    res.json({ success: true, data: aiResponse });
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing description', error: error.message });
  }
};

// @desc    Run ML detection and save final results (Phase 5)
// @route   POST /api/detection/detect
// @access  Private
const runDetection = async (req, res) => {
  try {
    const { detectionId, symptoms, duration, severity, patientDescription } = req.body;
    
    const detection = await Detection.findById(detectionId);
    if (!detection) return res.status(404).json({ message: 'Detection record not found' });

    // Update with phase 3/4 data
    detection.symptoms = symptoms;
    detection.duration = duration;
    detection.severity = severity;
    detection.patientDescription = patientDescription;

    // Prepare patient data for ML API
    const patient_data = {
      age: detection.demographics?.age || req.user.age || 30,
      gender: detection.demographics?.gender || req.user.gender || 'Other',
      height: detection.demographics?.height || req.user.height || 170,
      weight: detection.demographics?.weight || req.user.weight || 70,
      temp: detection.demographics?.temp || 98.6,
      bp: detection.demographics?.bp || 120,
      sugar: detection.demographics?.sugar || 90
    };

    const mlApiUrl = process.env.FLASK_API_URL || 'http://127.0.0.1:5001';

    // Call Flask API (Notice it's now /api/detect)
    const mlResponse = await axios.post(`${mlApiUrl}/api/detect`, {
      patient_data,
      symptoms
    });

    const mlData = mlResponse.data;
    if (mlData.error) {
      return res.status(500).json({ message: 'ML Service Error', details: mlData.error });
    }

    // Save ML results to database
    detection.detectedDisease = mlData.predicted_disease;
    detection.confidenceScore = mlData.confidence_score;
    detection.riskLevel = mlData.risk_level;
    
    // Recommendations
    detection.recommendations = {
      immediatePrecautions: mlData.precautions || [],
      suggestedTests: mlData.recommended_tests || []
    };

    await detection.save();

    res.status(200).json({
      success: true,
      detection,
      details: mlData // UI can use this for the interactive wizard
    });
  } catch (error) {
    console.error('Detection Error:', error.message);
    res.status(500).json({ message: 'Server error during detection', error: error.message });
  }
};

// @desc    Get user's detection history
// @route   GET /api/detection/history
// @access  Private
const getDetectionHistory = async (req, res) => {
  try {
    const history = await Detection.find({ patientId: req.user._id }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific detection report
// @route   GET /api/detection/report/:id
// @access  Private
const getDetectionReport = async (req, res) => {
  try {
    const report = await Detection.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    if (report.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startDetection,
  analyzeDescription,
  runDetection,
  getDetectionHistory,
  getDetectionReport
};
