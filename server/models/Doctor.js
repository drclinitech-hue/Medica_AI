const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  pmdcNumber: {
    type: String,
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number, // Years of experience
    required: true
  },
  consultationFee: {
    type: Number, // In PKR
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  hospitals: [{
    name: String,
    city: String
  }],
  languages: [String],
  consultationType: {
    type: String,
    enum: ['Physical', 'Online', 'Both'],
    default: 'Both'
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profilePhoto: {
    type: String, // URL
  },
  // Simple availability format for the demo
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String, // "09:00"
    endTime: String    // "17:00"
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
