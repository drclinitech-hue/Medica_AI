const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason, consultationType } = req.body;

    // Check if slot is already booked (simple check)
    const existing = await Appointment.findOne({ doctorId, date, timeSlot, status: { $in: ['Pending', 'Confirmed'] } });
    if (existing) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      timeSlot,
      reason,
      consultationType
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient's appointments
// @route   GET /api/appointments/my-appointments
// @access  Private (Patient)
const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ date: -1 });
    
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor's appointments
// @route   GET /api/appointments/doctor-appointments
// @access  Private (Doctor)
const getDoctorAppointments = async (req, res) => {
  try {
    // First find the doctor profile for this user
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId', 'name email')
      .sort({ date: -1 });
    
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
};
