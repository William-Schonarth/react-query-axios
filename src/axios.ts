import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.0.134:8000/api",
});

API.interceptors.request.use(
  (config) => {
    if (config) {
      config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzdWFyaW8iOiJhZG1pbkBtaWNyb3N5cy5pbmYuYnIifSwiaWF0IjoxNzAxMjgwNDA1LCJleHAiOjE3MDE4ODUyMDUsImlzcyI6Imh0dHBzOi8vYXBpLm1zeXNnZXN0b3IuY29tIn0.Vb5Iq3w4jAE7aOQYnActyl6xRWtrc8dG09BhiWqblMc`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { API };
