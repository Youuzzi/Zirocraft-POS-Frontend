import api from "./api";

export const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });

    if (response.data && response.data.token) {
      // Simpan semua ke LocalStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("name", response.data.name); // SEKARANG PASTI ADA ISINYA

      return response.data;
    }
  } catch (error) {
    // Biar lo tau error aslinya apa, kita log di console
    console.error("Detail Error Login:", error.response?.data);
    throw error;
  }
};
