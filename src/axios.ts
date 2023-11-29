import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

API.interceptors.request.use(
  (config) => {
    if (config) {
      config.headers.Authorization = `Bearer TOKEN_HERE`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { API };
