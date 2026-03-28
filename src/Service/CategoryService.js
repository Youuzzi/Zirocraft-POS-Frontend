import api from "./api"; // PAKAI INI, JANGAN AXIOS LANGSUNG

// Ambil semua kategori
export const fetchCategories = async () => {
  // Pake api.get supaya interceptor nempel header Authorization
  return await api.get("/categories");
};

// Tambah kategori (Butuh Admin)
export const addCategory = async (formData) => {
  return await api.post("/admin/categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Hapus kategori (Butuh Admin)
export const deleteCategory = async (id) => {
  return await api.delete(`/admin/categories/${id}`);
};
