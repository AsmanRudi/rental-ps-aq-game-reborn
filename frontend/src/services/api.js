import axios from 'axios';

const API = axios.create({
  baseURL: 'https://rental-ps-aq-game-reborn.vercel.app/api',
});

// Interceptor untuk menyisipkan Token JWT otomatis
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