import axios from 'axios';

const API = axios.create({
  baseURL: 'https://rental-ps-aq-game-reborn-hals08v6q-rudi-asman-salims-projects.vercel.app/api',
});

// Interceptor untuk menyisipkan token JWT otomatis
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // <-- PERHATIAN: Kembalikan 'config', bukan 'config.headers'
}, (error) => {
  return Promise.reject(error);
});

export default API;