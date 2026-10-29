import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://rental-ps-aq-game-reborn-hals08v6q-rudi-asman-salims-projects.vercel.app/api',
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const token = JSON.parse(userInfo).token;
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return req;
});

export default API;