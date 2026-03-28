import api from "./api"; // Pastikan pake api.js biar Token Admin lo kebawa

// 1. Ambil semua daftar user (Hanya bisa diakses ADMIN)
export const fetchUsers = async () => {
  return await api.get("/admin/users");
};

// 2. Registrasi User Baru (Cashier/Admin)
export const registerUser = async (userData) => {
  // userData berisi: { name, email, password, role }
  return await api.post("/admin/users/register", userData);
};

// 3. Hapus User
export const deleteUser = async (id) => {
  return await api.delete(`/admin/users/${id}`);
};
