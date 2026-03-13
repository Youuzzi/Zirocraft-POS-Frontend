import React from "react";
import "./Dashboard.css"; // Import CSS yang baru dibuat
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard-container text-light">
      {/* --- HEADER --- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Dashboard</h2>
          <p className="text-secondary m-0 small">
            Welcome back, Administrator!
          </p>
        </div>
        <div className="text-end">
          <span className="badge bg-secondary px-3 py-2">
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* --- 1. BARIS KARTU STATISTIK (STATS CARDS) --- */}
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
            {" "}
            {/* Bisa diklik ke Produk */}
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

      {/* --- 2. TABEL AKTIVITAS TERBARU (DUMMY) --- */}
      <h4 className="section-title">Recent Transactions</h4>

      <div className="table-responsive bg-dark p-3 rounded border border-secondary shadow-sm">
        <table className="table table-dark table-hover align-middle mb-0">
          <thead>
            <tr className="text-secondary small text-uppercase">
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Data Palsu biar kelihatan ramai */}
            <tr>
              <td>#ORD-001</td>
              <td>Walk-in Customer</td>
              <td>Today, 10:45</td>
              <td>Rp 45.000</td>
              <td>
                <span className="badge bg-success bg-opacity-25 text-success">
                  Completed
                </span>
              </td>
              <td>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-eye"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>#ORD-002</td>
              <td>Meja No. 4</td>
              <td>Today, 11:20</td>
              <td>Rp 120.000</td>
              <td>
                <span className="badge bg-warning bg-opacity-25 text-warning">
                  Pending
                </span>
              </td>
              <td>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-eye"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>#ORD-003</td>
              <td>Gojek Driver</td>
              <td>Yesterday</td>
              <td>Rp 75.000</td>
              <td>
                <span className="badge bg-success bg-opacity-25 text-success">
                  Completed
                </span>
              </td>
              <td>
                <button className="btn btn-sm btn-outline-secondary">
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
