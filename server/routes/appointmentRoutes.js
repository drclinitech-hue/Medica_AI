const express = require('express');
const router = express.Router();
const { 
  bookAppointment, 
  getPatientAppointments, 
  getDoctorAppointments, 
  updateAppointmentStatus 
} = require('../controllers/appointmentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, bookAppointment);
router.get('/my-appointments', protect, getPatientAppointments);
router.get('/doctor-appointments', protect, getDoctorAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);

module.exports = router;
