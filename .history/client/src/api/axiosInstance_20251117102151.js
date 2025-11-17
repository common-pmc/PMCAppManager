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

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use (
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token has expired or is invalid
      localStorage.removeItem ('token');
      window.location.href = '/login';
    }
    return Promise.reject (error);
  }
);

export default axiosInstance;
