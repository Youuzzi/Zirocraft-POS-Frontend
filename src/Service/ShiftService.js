import api from "./api";

export const getActiveShift = async (userId) => {
  return await api.get(`/shifts/current/${userId}`);
};

export const openShift = async (data) => {
  return await api.post("/shifts/open", data);
};

// Pipa untuk tutup shift
export const closeShift = async (data) => {
  // data: { shiftId, actualBalance }
  return await api.post("/shifts/close", data);
};
