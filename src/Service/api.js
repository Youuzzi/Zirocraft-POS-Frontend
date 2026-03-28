import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1.0",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // JANGAN kirim header Authorization kalau URL-nya mengandung 'login'
    if (
      token &&
      !config.url.includes("/login") &&
      token !== "[object Object]"
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
