const User = require('../models/User');
const Detection = require('../models/Detection');
const Appointment = require('../models/Appointment');

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

module.exports = {
  getDashboardStats,
  getUsers
};
