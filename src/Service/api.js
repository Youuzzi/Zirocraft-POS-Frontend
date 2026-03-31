import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1.0",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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

// --- LOGIC BARU: TENDANG USER JIKA TOKEN MATI ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Jika token expired atau akses dilarang
      localStorage.clear();
      window.location.href = "/login"; // Force redirect ke login
    }
    return Promise.reject(error);
  },
);

export default api;
