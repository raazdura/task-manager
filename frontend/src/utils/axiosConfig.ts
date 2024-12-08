import axios from "axios";

// Base Axios instance
const axiosInstance = axios.create({
  baseURL: "https://your-backend-api.com/api", // Replace with your backend API URL
  timeout: 5000,
});

// Add JWT token to headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Retrieve token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
