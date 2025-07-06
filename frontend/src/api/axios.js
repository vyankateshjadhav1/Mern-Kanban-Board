import axios from "axios";

const API = axios.create({
  baseURL: "https://taskflow-yjut.onrender.com/api", // or localhost
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
