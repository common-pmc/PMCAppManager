import axios from 'axios';

const axiosInstance = axios.create ({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use ();
