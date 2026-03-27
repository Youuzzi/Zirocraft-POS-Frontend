import api from "./api";

// 1. Ambil semua item/produk
export const fetchItems = async () => {
  return await api.get("/admin/items");
};

// 2. Tambah item baru (FormData untuk Upload Gambar)
export const addItem = async (formData) => {
  return await api.post("/admin/items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 3. Hapus item
export const deleteItem = async (id) => {
  return await api.delete(`/admin/items/${id}`);
};
