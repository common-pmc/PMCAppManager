import axios from 'axios';

const baseURL = import.meta.env.MODE === 'production'
  ? `${window.location.origin}/api`
  : import.meta.env.VITE_API_BASE_URL

const axiosInstance = axios.create ({
  baseURL
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use (config => {
  const token = localStorage.getItem ('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
