import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

const startDetection = async (demographics, medicalHistory) => {
  const response = await axios.post(`${API_URL}/detection/start`, { demographics, medicalHistory }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const analyzeDescription = async (history) => {
  const response = await axios.post(`${API_URL}/detection/analyze`, { history }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const runDetection = async (payload) => {
  // payload should include detectionId, symptoms, duration, severity, patientDescription
  const response = await axios.post(`${API_URL}/detection/detect`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const getDetectionHistory = async () => {
  const response = await axios.get(`${API_URL}/detection/history`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const getDetectionReport = async (id) => {
  const response = await axios.get(`${API_URL}/detection/report/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export default {
  startDetection,
  analyzeDescription,
  runDetection,
  getDetectionHistory,
  getDetectionReport
};
