import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { fetchRecentOrders, processVoid } from "../../Service/OrderService";
import api from "../../Service/api";
import toast from "react-hot-toast";
import Receipt from "../../components/Receipt/Receipt";

const Dashboard = () => {
  const { userName, settings, activeShift, isDataLoaded } =
    useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [shiftHistory, setShiftHistory] = useState([]);
  const [expenseLogs, setExpenseLogs] = useState([]);

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const [showDetailReceipt, setShowDetailReceipt] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const role = localStorage.getItem("role");
  const userEmail = localStorage.getItem("email");

  const formattedDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const loadDashboardData = async () => {
    if (!isDataLoaded) return;
    try {
      let url =
        role === "ROLE_ADMIN"
          ? "/orders/recent"
          : `/orders/recent?shiftId=${activeShift?.id || 0}`;
      const resOrders = await api.get(url);
      if (resOrders.data) setOrders(resOrders.data);

      if (role === "ROLE_ADMIN") {
        const [resSummary, resShifts, resExpenses] = await Promise.all([
          api.get("/orders/summary"),
          api.get("/shifts/history"),
          api.get("/shifts/expenses/all"),
        ]);
        if (resSummary.data) setStats(resSummary.data);
        if (resShifts.data) setShiftHistory(resShifts.data);
        if (resExpenses.data)
          setExpenseLogs(resExpenses.data.sort((a, b) => b.id - a.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [isDataLoaded, activeShift]);

  const handleViewDetail = (order) => {
    setSelectedOrder({
      ...order,
      date: new Date(order.createdAt).toLocaleString("id-ID"),
      cash: order.totalAmount,
      change: 0,
    });
    setShowDetailReceipt(true);
  };

  const handleVoid = async (id) => {
    const reason = window.prompt("Alasan VOID:");
    if (!reason) return;
    try {
      await processVoid(id, reason, userEmail);
      toast.success("VOID Berhasil!");
      loadDashboardData();
    } catch (err) {
      toast.error("Hanya Admin yang bisa Void!");
    }
  };

  return (
    <div className="dashboard-container text-light">
      {showDetailReceipt && selectedOrder && (
        <Receipt
          orderData={selectedOrder}
          settings={settings}
          onClose={() => setShowDetailReceipt(false)}
        />
      )}

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start mb-5">
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center border border-info border-opacity-25"
            style={{ width: "60px", height: "60px" }}
          >
            <i className="bi bi-person-circle text-info fs-1"></i>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h2 className="ziro-title m-0">Dashboard</h2>
              <span
                className={`badge ${role === "ROLE_ADMIN" ? "bg-info text-dark" : "bg-success text-white"} rounded-pill`}
                style={{
                  fontSize: "10px",
                  padding: "5px 12px",
                  fontWeight: "800",
                }}
              >
                {role === "ROLE_ADMIN" ? "ADMINISTRATOR" : "CASHIER"}
              </span>
            </div>
            <p className="text-secondary m-0 mt-1 small">
              Selamat datang kembali,{" "}
              <span className="text-info fw-bold">{userName}</span>
            </p>
          </div>
        </div>
        <div className="text-end">
          <div
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 border border-secondary border-opacity-25"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              fontSize: "12px",
            }}
          >
            <i className="bi bi-calendar3 text-info"></i>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* STATS (Hanya Admin) */}
      {role === "ROLE_ADMIN" ? (
        <div className="row g-4 mb-5">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="stat-card border-left-success">
              <div>
                <p className="text-secondary mb-1 small fw-bold text-uppercase">
                  Total Omzet
                </p>
                <h3 className="fw-bold text-success m-0">
                  Rp {stats.totalSales?.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="stat-card border-left-info">
              <div>
                <p className="text-secondary mb-1 small fw-bold text-uppercase">
                  Total Order
                </p>
                <h3 className="fw-bold text-info m-0">{stats.totalOrders}</h3>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="stat-card border-left-warning">
              <div>
                <p className="text-secondary mb-1 small fw-bold text-uppercase">
                  Items
                </p>
                <h3 className="fw-bold text-warning m-0">
                  {stats.totalProducts}
                </h3>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="stat-card border-left-danger">
              <div>
                <p className="text-secondary mb-1 small fw-bold text-uppercase">
                  Tim
                </p>
                <h3 className="fw-bold text-danger m-0">{stats.totalUsers}</h3>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="alert bg-dark border-secondary p-4 mb-5 shadow-sm"
          style={{ borderRadius: "15px", borderLeft: "4px solid #0dcaf0" }}
        >
          {activeShift ? (
            <>
              <h5 className="text-info fw-bold m-0">
                Terminal Kasir Aktif: #{activeShift.id}
              </h5>
              <p className="text-secondary m-0 small">
                Menampilkan histori 5 transaksi terakhir Anda pada sesi ini.
              </p>
            </>
          ) : (
            <>
              <h5 className="text-warning fw-bold m-0">Sesi Belum Dibuka</h5>
              <p className="text-secondary m-0 small">
                Silakan buka shift baru di menu Kasir untuk memulai penjualan.
              </p>
            </>
          )}
        </div>
      )}

      {/* TABLE TRANSAKSI */}
      <h4 className="section-title">Transactions Log</h4>
      <div
        className="table-responsive p-3 shadow-sm mb-5"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: "15px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <table className="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr className="text-uppercase" style={{ fontSize: "10px" }}>
              <th>Nota</th>
              {role === "ROLE_ADMIN" && <th>Kasir</th>}
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 opacity-50">
                  Belum ada transaksi.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td className="text-info fw-medium">{o.orderNumber}</td>
                  {role === "ROLE_ADMIN" && (
                    <td className="small">
                      {o.userId?.split("@")[0].toUpperCase()}
                    </td>
                  )}
                  <td>{o.customerName}</td>
                  <td className="fw-bold">
                    Rp {o.totalAmount?.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`badge px-3 py-2 ${o.status === "COMPLETED" ? "bg-success" : "bg-danger"} bg-opacity-10 text-${o.status === "COMPLETED" ? "success" : "danger"}`}
                      style={{ fontSize: "10px" }}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-3">
                      <button
                        onClick={() => handleViewDetail(o)}
                        className="btn btn-sm text-info p-0"
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>
                      {role === "ROLE_ADMIN" && o.status === "COMPLETED" && (
                        <button
                          onClick={() => handleVoid(o.id)}
                          className="btn btn-sm text-danger p-0"
                        >
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* AUDIT LOGS (ADMIN ONLY) */}
      {role === "ROLE_ADMIN" && (
        <div className="row g-4 mt-2">
          <div className="col-lg-7">
            <h4 className="section-title">
              Shift Audit Trail (Rekonsiliasi Kas)
            </h4>
            <div
              className="table-responsive p-3 shadow-sm"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderRadius: "15px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr className="text-uppercase" style={{ fontSize: "10px" }}>
                    <th>Staff</th>
                    <th>Waktu Tutup</th>
                    <th className="text-end">Sistem</th>
                    <th className="text-end">Fisik</th>
                    <th className="text-end">Selisih</th>
                  </tr>
                </thead>
                <tbody>
                  {shiftHistory.map((s) => (
                    <tr key={s.id}>
                      <td>{s.userId?.split("@")[0].toUpperCase()}</td>
                      <td className="small opacity-50">
                        {s.endTime
                          ? new Date(s.endTime).toLocaleString("id-ID", {
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="text-end">
                        Rp {(s.expectedBalance || 0).toLocaleString()}
                      </td>
                      <td className="text-end">
                        Rp {(s.actualBalance || 0).toLocaleString()}
                      </td>
                      <td
                        className={`text-end fw-bold ${s.variance < 0 ? "text-danger" : "text-success"}`}
                      >
                        {s.variance > 0 ? "+" : ""}
                        {(s.variance || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-lg-5">
            <h4 className="section-title">Expense Log (Petty Cash)</h4>
            <div
              className="table-responsive p-3 shadow-sm"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderRadius: "15px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr className="text-uppercase" style={{ fontSize: "10px" }}>
                    <th>Staff</th>
                    <th>Deskripsi</th>
                    <th className="text-end">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseLogs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4 opacity-50">
                        No expenses recorded.
                      </td>
                    </tr>
                  ) : (
                    expenseLogs.map((e) => (
                      <tr key={e.id}>
                        <td className="small">
                          {e.userId?.split("@")[0].toUpperCase()}
                        </td>
                        <td className="small">{e.description}</td>
                        <td className="text-end text-warning fw-bold">
                          Rp {(e.amount || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
