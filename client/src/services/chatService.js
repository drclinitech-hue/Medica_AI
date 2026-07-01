import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;

const sendChatMessage = async (history) => {
  const response = await axios.post(`${API_URL}/chat/message`, { history });
  return response.data;
};

export default {
  sendChatMessage
};
