import api from "./api";

export const processCheckout = async (orderData, email, shiftId) => {
  return await api.post(
    `/orders/create?email=${email}&shiftId=${shiftId}`,
    orderData,
  );
};

// --- LOGIC BARU: AMBIL TRANSAKSI TERBARU ---
export const fetchRecentOrders = async () => {
  return await api.get("/orders/recent");
};

// --- LOGIC BARU: PROSES VOID ---
export const processVoid = async (orderId, reason, adminEmail) => {
  return await api.delete(
    `/orders/void/${orderId}?reason=${reason}&adminEmail=${adminEmail}`,
  );
};
