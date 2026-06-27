import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

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

export default {
  getDashboardStats,
  getUsers
};
