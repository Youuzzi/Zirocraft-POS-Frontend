import api from "./api";

export const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });

    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("email", response.data.email); // SIMPAN EMAIL JUGA
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};
