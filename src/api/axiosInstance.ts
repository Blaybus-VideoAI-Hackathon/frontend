import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://hdb-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});
