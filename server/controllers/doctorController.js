const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Review = require('../models/Review');

// @desc    Get all doctors with filtering and pagination
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const { city, specialization, search, minFee, maxFee } = req.query;

    let query = { isVerified: true };

    if (city) {
      query['hospitals.city'] = { $regex: city, $options: 'i' };
    }
    
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (minFee || maxFee) {
      query.consultationFee = {};
      if (minFee) query.consultationFee.$gte = Number(minFee);
      if (maxFee) query.consultationFee.$lte = Number(maxFee);
    }

    // Populate user to get name and email
    // If there's a search term, we need to find Users first, then find Doctors by userId
    if (search) {
      const users = await User.find({
        role: 'doctor',
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      const userIds = users.map(u => u._id);
      
      query.userId = { $in: userIds };
    }

    const doctors = await Doctor.find(query)
      .populate('userId', 'name email profilePhoto')
      .sort({ rating: -1 });

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email profilePhoto');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Fetch reviews
    const reviews = await Review.find({ doctorId: doctor._id })
      .populate('patientId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ doctor, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended doctors based on predicted disease
// @route   POST /api/doctors/recommend
// @access  Public
const getRecommendedDoctors = async (req, res) => {
  try {
    const { disease } = req.body;
    
    // Basic mapping logic
    let targetSpecializations = ['General Physician'];
    const diseaseLower = disease?.toLowerCase() || '';

    if (diseaseLower.includes('heart') || diseaseLower.includes('cardiac')) {
      targetSpecializations.push('Cardiologist');
    } else if (diseaseLower.includes('brain') || diseaseLower.includes('migraine')) {
      targetSpecializations.push('Neurologist');
    } else if (diseaseLower.includes('skin') || diseaseLower.includes('rash') || diseaseLower.includes('fungal') || diseaseLower.includes('acne')) {
      targetSpecializations.push('Dermatologist');
    } else if (diseaseLower.includes('lung') || diseaseLower.includes('asthma') || diseaseLower.includes('breath')) {
      targetSpecializations.push('Pulmonologist');
    } else if (diseaseLower.includes('bone') || diseaseLower.includes('joint') || diseaseLower.includes('arthritis')) {
      targetSpecializations.push('Orthopedic Surgeon');
    } else if (diseaseLower.includes('diabetes') || diseaseLower.includes('thyroid')) {
      targetSpecializations.push('Endocrinologist');
    } else if (diseaseLower.includes('kidney') || diseaseLower.includes('urinary')) {
      targetSpecializations.push('Nephrologist', 'Urologist');
    } else if (diseaseLower.includes('stomach') || diseaseLower.includes('gerd') || diseaseLower.includes('peptic')) {
      targetSpecializations.push('Gastroenterologist');
    } else if (diseaseLower.includes('infection') || diseaseLower.includes('dengue') || diseaseLower.includes('malaria') || diseaseLower.includes('typhoid')) {
      targetSpecializations.push('Infectious Disease', 'Internal Medicine');
    }

    const doctors = await Doctor.find({
      isVerified: true,
      specialization: { $in: targetSpecializations }
    })
      .populate('userId', 'name email profilePhoto')
      .sort({ rating: -1 })
      .limit(5); // Return top 5

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current doctor profile (for Doctor Dashboard)
// @route   GET /api/doctors/profile/me
// @access  Private (Doctor only)
const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id }).populate('userId', 'name email');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  getRecommendedDoctors,
  getMyDoctorProfile
};
