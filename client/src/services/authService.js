import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register user
const register = async (userData) => {
  localStorage.removeItem('user');
  const response = await api.post('/auth/register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  localStorage.removeItem('user');
  const response = await api.post('/auth/login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get user profile
const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

// Update user profile
const updateProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  if (response.data) {
    // Update local storage user token/info
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export default {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};
