import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/admin` : `http://${window.location.hostname}:5000/api/admin`;

// Add token to headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`
    }
  };
};

const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/dashboard`, getAuthHeaders());
  return response.data.data;
};

const getUsers = async (page = 1, limit = 10, search = '', role = '') => {
  let url = `${API_URL}/users?page=${page}&limit=${limit}`;
  if (search) url += `&search=${search}`;
  if (role) url += `&role=${role}`;
  
  const response = await axios.get(url, getAuthHeaders());
  return response.data;
};

const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/users/${id}`, getAuthHeaders());
  return response.data;
};

const updateUserRole = async (id, role) => {
  const response = await axios.put(`${API_URL}/users/${id}`, { role }, getAuthHeaders());
  return response.data;
};

const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, userData, getAuthHeaders());
  return response.data;
};

const getDoctors = async () => {
  const response = await axios.get(`${API_URL}/doctors`, getAuthHeaders());
  return response.data.data;
};

const createDoctor = async (doctorData) => {
  const response = await axios.post(`${API_URL}/doctors`, doctorData, getAuthHeaders());
  return response.data;
};

const updateDoctorStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/doctors/${id}`, { status }, getAuthHeaders());
  return response.data;
};

const deleteDoctor = async (id) => {
  const response = await axios.delete(`${API_URL}/doctors/${id}`, getAuthHeaders());
  return response.data;
};

const getPatients = async () => {
  const response = await axios.get(`${API_URL}/patients`, getAuthHeaders());
  return response.data.data;
};

const getAppointments = async () => {
  const response = await axios.get(`${API_URL}/appointments`, getAuthHeaders());
  return response.data.data;
};

const getDiseases = async () => {
  const response = await axios.get(`${API_URL}/diseases`, getAuthHeaders());
  return response.data.data;
};

const createDisease = async (diseaseData) => {
  const response = await axios.post(`${API_URL}/diseases`, diseaseData, getAuthHeaders());
  return response.data;
};

const deleteDisease = async (id) => {
  const response = await axios.delete(`${API_URL}/diseases/${id}`, getAuthHeaders());
  return response.data;
};

export default {
  getDashboardStats,
  getUsers,
  createUser,
  deleteUser,
  updateUserRole,
  getDoctors,
  createDoctor,
  updateDoctorStatus,
  deleteDoctor,
  getPatients,
  getAppointments,
  getDiseases,
  createDisease,
  deleteDisease
};
