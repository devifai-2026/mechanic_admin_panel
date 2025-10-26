// utils/axiosInstance.ts
import axios from "axios";

const isProduction = true; // Change this to false for development

const url = {
  production: "https://www.devifai.website/api/master/super/admin",
  development: "http://localhost:8000/api/master/super/admin",
};

const axiosInstance = axios.create({
  baseURL: isProduction ? url.production : url.development,
  headers: {
    "Content-Type": "application/json",
  },
});

// utils/axiosInstance.ts
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration/errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    if (error.response?.status === 401) {
      // Handle unauthorized access (token expired/invalid)
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      window.location.href = "/signin"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
