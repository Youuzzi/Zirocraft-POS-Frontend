import api from "./api";

export const getActiveShift = async (userId) => {
  return await api.get(`/shifts/current/${userId}`);
};

export const openShift = async (data) => {
  return await api.post("/shifts/open", data);
};

export const recordExpense = async (data) => {
  // data: { shiftId, description, amount, userId }
  return await api.post("/shifts/expense", data);
};

export const closeShift = async (data) => {
  return await api.post("/shifts/close", data);
};
