import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// Book an appointment (Patient)
const bookAppointment = async (appointmentData) => {
  const response = await axios.post(`${API_URL}/appointments`, appointmentData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Get patient's appointments (Patient)
const getPatientAppointments = async () => {
  const response = await axios.get(`${API_URL}/appointments/my-appointments`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Get doctor's appointments (Doctor)
const getDoctorAppointments = async () => {
  const response = await axios.get(`${API_URL}/appointments/doctor-appointments`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Update appointment status (Doctor/Admin)
const updateAppointmentStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/appointments/${id}/status`, { status }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export default {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
};
