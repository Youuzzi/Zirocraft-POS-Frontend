import api from "./api";

export const fetchItems = async () => {
  // Pake api instance
  return await api.get("/admin/items");
};

export const addItem = async (formData) => {
  return await api.post("/admin/items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteItem = async (id) => {
  return await api.delete(`/admin/items/${id}`);
};
