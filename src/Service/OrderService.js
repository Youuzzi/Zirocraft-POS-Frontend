import api from "./api";

export const processCheckout = async (orderData, email, shiftId) => {
  return await api.post(
    `/orders/create?email=${email}&shiftId=${shiftId}`,
    orderData,
  );
};
