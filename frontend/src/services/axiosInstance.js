import axios from 'axios';

// base url for all api calls
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// attach token to every request if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// if backend returns 401, clear stored token and redirect to login
// this happens when backend restarts and h2 data is cleared (token becomes invalid)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
