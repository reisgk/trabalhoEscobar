import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-completo.vercel.app/app',
});

export default api; 