import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1.0", // Context path lo di sini
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Jika login, hapus header Authorization biar nggak diblokir 403
    if (config.url.includes("/login")) {
      delete config.headers.Authorization;
    } else if (token && token !== "[object Object]") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
