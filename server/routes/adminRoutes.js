const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getUsers, 
  deleteUser,
  getDoctors,
  deleteDoctor,
  getPatients,
  getAppointments
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/adminMiddleware');

// Apply protection and RBAC to all routes in this file
router.use(protect);
router.use(authorizeRoles('admin', 'superadmin', 'moderator'));

router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

// Doctors
router.get('/doctors', getDoctors);
router.delete('/doctors/:id', deleteDoctor);

// Patients
router.get('/patients', getPatients);

// Appointments
router.get('/appointments', getAppointments);

module.exports = router;
