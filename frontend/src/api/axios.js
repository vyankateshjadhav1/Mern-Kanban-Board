import axios from "axios";

const API = axios.create({
  baseURL: "https://taskflow-yjut.onrender.com",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  console.log("👉 Attaching token:", token);  // <- Add this
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
