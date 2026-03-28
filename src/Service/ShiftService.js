import api from "./api";

export const getActiveShift = async (userId) => {
  return await api.get(`/shifts/current/${userId}`);
};

export const openShift = async (data) => {
  // data: { userId, openingBalance }
  return await api.post("/shifts/open", data);
};
