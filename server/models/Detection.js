const mongoose = require('mongoose');

const detectionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  // Phase 1: Demographics
  demographics: {
    age: Number,
    gender: String,
    height: Number, // in cm
    weight: Number, // in kg
    bmi: Number,
    bloodGroup: String,
    temp: Number, // in F
    bp: Number, // Systolic
    sugar: Number, // mg/dL
    lifestyle: {
      smoking: String,
      alcohol: String,
      physicalActivity: String,
    }
  },
  // Phase 2: Medical History
  medicalHistory: {
    chronicDiseases: [String],
    allergies: [String],
  },
  // Phase 3 & 4: AI Symptom Analysis
  symptoms: [{
    type: String
  }],
  duration: String,
  severity: String,
  patientDescription: String,
  
  // Phase 5: Detection Results (from ML)
  detectedDisease: {
    type: String
  },
  confidenceScore: {
    type: Number
  },
  alternativeDiseases: [{
    disease: String,
    probability: Number
  }],
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    default: 'Low',
  },
  // Phase 6: Recommendations
  recommendations: {
    immediatePrecautions: [String],
    suggestedTests: [String]
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Detection', detectionSchema);
