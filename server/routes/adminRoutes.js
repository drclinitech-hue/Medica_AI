const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getUsers, 
  deleteUser,
  getDoctors,
  deleteDoctor,
  getPatients,
  getAppointments,
  createDoctor,
  updateDoctorStatus,
  updateUserRole,
  createUser,
  getDiseases,
  createDisease,
  deleteDisease
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/adminMiddleware');

// Apply protection and RBAC to all routes in this file
router.use(protect);
router.use(authorizeRoles('admin', 'superadmin', 'moderator'));

router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getUsers);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUserRole);

// Doctors
router.get('/doctors', getDoctors);
router.post('/doctors', createDoctor);
router.put('/doctors/:id', updateDoctorStatus);
router.delete('/doctors/:id', deleteDoctor);

// Patients
router.get('/patients', getPatients);

// Diseases
router.get('/diseases', getDiseases);
router.post('/diseases', createDisease);
router.delete('/diseases/:id', deleteDisease);

// Appointments
router.get('/appointments', getAppointments);

module.exports = router;
