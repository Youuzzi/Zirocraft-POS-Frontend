import api from "./api";

export const fetchSettings = async () => {
  return await api.get("/admin/settings");
};

export const updateSettings = async (data) => {
  return await api.put("/admin/settings", data);
};
