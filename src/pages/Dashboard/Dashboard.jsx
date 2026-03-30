import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "./Dashboard.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Ambil data reaktif dari Context
  const { userName } = useContext(AppContext);

  // Format Tanggal Pro
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
      {/* --- HEADER --- */}
      <div className="d-flex justify-content-between align-items-start mb-5">
        <div>
          <h2 className="ziro-title m-0">Dashboard</h2>
          <p className="text-secondary m-0 mt-2" style={{ fontSize: "15px" }}>
            Selamat datang kembali,{" "}
            <span className="text-info fw-bold">{userName}</span>
          </p>
        </div>

        <div className="text-end">
          <div
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 border border-secondary border-opacity-25"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
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
        <div className="col-12 col-md-6 col-lg-3">
          <div className="stat-card border-left-success">
            <div>
              <p className="text-secondary mb-1 small fw-bold text-uppercase">
                Total Sales
              </p>
              <h3 className="fw-bold text-success m-0">Rp 15.2M</h3>
            </div>
            <div className="icon-box">
              <i className="bi bi-cash-stack"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="stat-card border-left-info">
            <div>
              <p className="text-secondary mb-1 small fw-bold text-uppercase">
                Total Orders
              </p>
              <h3 className="fw-bold text-info m-0">1,240</h3>
            </div>
            <div className="icon-box">
              <i className="bi bi-cart-check"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <Link to="/items" className="text-decoration-none">
            <div className="stat-card border-left-warning">
              <div>
                <p className="text-secondary mb-1 small fw-bold text-uppercase">
                  Total Products
                </p>
                <h3 className="fw-bold text-warning m-0">85</h3>
              </div>
              <div className="icon-box">
                <i className="bi bi-box-seam"></i>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <Link to="/users" className="text-decoration-none">
            <div className="stat-card border-left-danger">
              <div>
                <p className="text-secondary mb-1 small fw-bold text-uppercase">
                  Active Users
                </p>
                <h3 className="fw-bold text-danger m-0">12</h3>
              </div>
              <div className="icon-box">
                <i className="bi bi-people"></i>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* --- 2. TABEL AKTIVITAS TERBARU --- */}
      <h4 className="section-title">Recent Transactions</h4>
      <div className="table-responsive p-3 shadow-sm">
        <table className="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr className="text-uppercase">
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
              <td className="small opacity-50">Today, 10:45</td>
              <td className="fw-bold">Rp 45.000</td>
              <td>
                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2">
                  Completed
                </span>
              </td>
              <td className="text-center">
                <button className="btn btn-sm text-secondary border-0">
                  <i className="bi bi-eye-fill"></i>
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
