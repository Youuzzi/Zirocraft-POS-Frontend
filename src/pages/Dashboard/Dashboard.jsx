import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "./Dashboard.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // 1. Ambil userName reaktif dari Context
  const { userName } = useContext(AppContext);

  // 2. Format Tanggal yang lebih Cantik & Pro (Contoh: Sabtu, 28 Maret 2026)
  const today = new Date();
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("id-ID", dateOptions);

  return (
    <div className="dashboard-container text-light">
      {/* --- HEADER SECTION --- */}
      <div className="d-flex justify-content-between align-items-start mb-5">
        <div>
          <h2 className="fw-bold m-0 ziro-title">Dashboard</h2>
          {/* Greeting: Tanda seru dihapus & warna dibuat lebih soft agar tidak kontras tajam */}
          <p
            className="text-secondary m-0 mt-2"
            style={{ fontSize: "15px", letterSpacing: "0.5px" }}
          >
            Selamat datang kembali,{" "}
            <span className="text-info fw-semibold">{userName}</span>
          </p>
        </div>

        {/* Tanggal: Warna lebih ramah mata (Soft Border, Semi-Transparent) */}
        <div className="text-end">
          <div
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 border border-secondary border-opacity-25"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              fontSize: "13px",
              color: "#aaa",
            }}
          >
            <i className="bi bi-calendar3 text-info"></i>
            <span className="fw-medium">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* --- 1. BARIS KARTU STATISTIK --- */}
      <div className="row g-4 mb-5">
        {/* Card 1: Total Sales */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="stat-card border-left-success">
            <div>
              <p className="text-secondary mb-1 small fw-bold text-uppercase">
                Total Sales
              </p>
              <h3 className="fw-bold text-success m-0">Rp 15.2M</h3>
            </div>
            <div className="icon-box text-success">
              <i className="bi bi-cash-stack"></i>
            </div>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="stat-card border-left-info">
            <div>
              <p className="text-secondary mb-1 small fw-bold text-uppercase">
                Total Orders
              </p>
              <h3 className="fw-bold text-info m-0">1,240</h3>
            </div>
            <div className="icon-box text-info">
              <i className="bi bi-cart-check"></i>
            </div>
          </div>
        </div>

        {/* Card 3: Total Products */}
        <div className="col-12 col-md-6 col-lg-3">
          <Link to="/items" className="text-decoration-none">
            <div className="stat-card border-left-warning">
              <div>
                <p className="text-secondary mb-1 small fw-bold text-uppercase">
                  Total Products
                </p>
                <h3 className="fw-bold text-warning m-0">85</h3>
              </div>
              <div className="icon-box text-warning">
                <i className="bi bi-box-seam"></i>
              </div>
            </div>
          </Link>
        </div>

        {/* Card 4: Total Users */}
        <div className="col-12 col-md-6 col-lg-3">
          <Link to="/users" className="text-decoration-none">
            <div className="stat-card border-left-danger">
              <div>
                <p className="text-secondary mb-1 small fw-bold text-uppercase">
                  Active Users
                </p>
                <h3 className="fw-bold text-danger m-0">12</h3>
              </div>
              <div className="icon-box text-danger">
                <i className="bi bi-people"></i>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* --- 2. TABEL AKTIVITAS TERBARU --- */}
      <h4 className="section-title">Recent Transactions</h4>
      <div className="table-responsive bg-dark p-3 rounded-4 border border-secondary border-opacity-25 shadow-sm">
        <table className="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr className="text-secondary small text-uppercase">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3">Customer</th>
              <th className="py-3">Date</th>
              <th className="py-3">Total</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="border-top-0">
            <tr>
              <td className="px-4 text-info fw-medium">#ORD-001</td>
              <td>Walk-in Customer</td>
              <td className="text-secondary small">Today, 10:45</td>
              <td className="fw-bold text-light">Rp 45.000</td>
              <td>
                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2">
                  Completed
                </span>
              </td>
              <td className="text-center">
                <button className="btn btn-sm btn-outline-secondary border-0">
                  <i className="bi bi-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
