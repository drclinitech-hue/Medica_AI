import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// Get all doctors with filters
const getDoctors = async (filters = {}) => {
  // Convert filter object to query string
  const queryParams = new URLSearchParams(filters).toString();
  const response = await axios.get(`${API_URL}/doctors?${queryParams}`);
  return response.data;
};

// Get doctor by ID
const getDoctorById = async (id) => {
  const response = await axios.get(`${API_URL}/doctors/${id}`);
  return response.data;
};

// Get recommended doctors based on disease
const getRecommendedDoctors = async (disease) => {
  const response = await axios.post(`${API_URL}/doctors/recommend`, { disease });
  return response.data;
};

// Get doctor profile (for logged in doctor)
const getMyDoctorProfile = async () => {
  const response = await axios.get(`${API_URL}/doctors/profile/me`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export default {
  getDoctors,
  getDoctorById,
  getRecommendedDoctors,
  getMyDoctorProfile,
};
