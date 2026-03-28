import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1.0",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Jika token valid, tempelkan ke header
    if (token && token !== "[object Object]" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
