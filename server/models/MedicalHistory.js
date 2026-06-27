const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  previousDiseases: [{
    type: String,
  }],
  allergies: [{
    type: String,
  }],
  familyHistory: [{
    type: String, // E.g., "Diabetes", "Heart Disease"
  }],
  smokingStatus: {
    type: String,
    enum: ['Never', 'Former', 'Current'],
    default: 'Never',
  },
  alcoholStatus: {
    type: String,
    enum: ['Never', 'Occasional', 'Frequent'],
    default: 'Never',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);
