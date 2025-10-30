// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tokenWeb");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expired or unauthorized!");
      localStorage.removeItem("tokenWeb");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
