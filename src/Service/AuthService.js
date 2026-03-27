import api from "./api";

export const login = async (email, password) => {
  try {
    // Request ke http://localhost:8080/api/v1.0/login
    const response = await api.post("/login", { email, password });

    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      return response.data;
    }
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};
