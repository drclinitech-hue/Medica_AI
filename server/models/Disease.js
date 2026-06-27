const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a disease name'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  symptoms: [{
    type: String,
  }],
  precautions: [{
    type: String,
  }],
  preventionTips: [{
    type: String,
  }],
  suggestedMedicines: [{
    type: String, // General OTC only as per requirements
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Disease', diseaseSchema);
