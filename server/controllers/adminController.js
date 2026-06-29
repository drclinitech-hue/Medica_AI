const User = require('../models/User');
const Detection = require('../models/Detection');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Basic counts
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalPredictions = await Detection.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    
    // Status counts for cards
    const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });

    // 1. Top Predicted Diseases (Bar Chart)
    const topDiseasesAggregation = await Detection.aggregate([
      { $group: { _id: '$detectedDisease', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // 2. Appointment Status (Doughnut Chart)
    const appointmentStatusAggregation = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 3. User Growth (Line Chart)
    // Grouping new patients by month for the current year
    const currentYear = new Date().getFullYear();
    const userGrowthAggregation = await User.aggregate([
      { 
        $match: { 
          role: 'patient',
          createdAt: { $gte: new Date(`${currentYear}-01-01`), $lte: new Date(`${currentYear}-12-31`) }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // 4. Recent Predictions Feed
    const recentPredictions = await Detection.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('patientId', 'name email');

    res.json({
      success: true,
      data: {
        totalUsers,
        totalPatients,
        totalDoctors,
        totalPredictions,
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        topDiseases: topDiseasesAggregation,
        appointmentStatus: appointmentStatusAggregation,
        userGrowth: userGrowthAggregation,
        recentPredictions
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// @desc    Get all users with pagination, sorting, filtering
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role || '';

    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Also cleanup Doctor record if they were a doctor
    if (user.role === 'doctor') await Doctor.findOneAndDelete({ userId: user._id });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/admin/doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email role createdAt');
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Doctor
// @route   DELETE /api/admin/doctors/:id
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    // Also remove their user account or downgrade them
    await User.findByIdAndDelete(doctor.userId);
    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all patients
// @route   GET /api/admin/patients
const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password').sort({ createdAt: -1 });
    // We can aggregate detections per patient if needed, but for now we just return patients
    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments
// @route   GET /api/admin/appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'userId')
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
      .sort({ appointmentDate: -1 });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  deleteUser,
  getDoctors,
  deleteDoctor,
  getPatients,
  getAppointments
};
