// src/api.ts
import axios from "axios";
import { Navigate } from "react-router-dom";

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
      localStorage.removeItem("userId");
      localStorage.removeItem("tokenWeb");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem("userId");
      localStorage.removeItem("tokenWeb");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      window.location.href = "/no-access";
    }
    return Promise.reject(error);
  }
);

export default api;
