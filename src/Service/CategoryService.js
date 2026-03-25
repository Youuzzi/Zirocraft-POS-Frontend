import axios from "axios";

// 1. Tambah kategori (Butuh /admin)
export const addCategory = async (category) => {
  return await axios.post(
    "http://localhost:8080/api/v1.0/admin/categories",
    category,
  );
};

// 2. Hapus kategori (Butuh /admin)
export const deleteCategory = async (categoryId) => {
  return await axios.delete(
    `http://localhost:8080/api/v1.0/admin/categories/${categoryId}`,
  );
};

// 3. Ambil/Lihat kategori (Bebas, gak perlu admin)
export const fetchCategories = async () => {
  return await axios.get("http://localhost:8080/api/v1.0/categories");
};
