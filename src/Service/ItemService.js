import api from "./api";

export const fetchItems = async () => {
  // Ganti dari /admin/items ke /items
  return await api.get("/items");
};

export const addItem = async (formData) => {
  return await api.post("/admin/items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteItem = async (id) => {
  return await api.delete(`/admin/items/${id}`);
};
