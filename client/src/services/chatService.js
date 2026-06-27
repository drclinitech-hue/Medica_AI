import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const sendChatMessage = async (history) => {
  const response = await axios.post(`${API_URL}/chat/message`, { history });
  return response.data;
};

export default {
  sendChatMessage
};
