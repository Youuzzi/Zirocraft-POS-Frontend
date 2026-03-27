import React from "react";
import { assets } from "../../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Menubar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout Berhasil!");
    navigate("/");
  };

  const handleClose = () => {
    const closeBtn = document.querySelector(".offcanvas-header .btn-close");
    if (closeBtn) closeBtn.click();
  };

  return (
    <nav className="navbar navbar-dark bg-dark shadow-sm py-3 sticky-top">
      <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
        {/* --- KIRI: TOGGLER + BRANDING --- */}
        <div className="d-flex align-items-center gap-3">
          <button
            className="navbar-toggler border-0 p-0 focus-ring focus-ring-dark"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <Link
            to="/dashboard"
            className="navbar-brand d-flex align-items-center me-0"
          >
            <img src={assets.favicon} alt="Ziro" width="32" height="32" />
            <div
              className="ms-3 d-flex flex-column"
              style={{ lineHeight: "1.1" }}
            >
              <span
                className="fw-bold fs-4 text-white"
                style={{ letterSpacing: "1px" }}
              >
                ZIRO<span style={{ color: "#0dcaf0" }}>SHOP</span>
              </span>
              {/* ADMIN DASHBOARD dibikin lebih terang (text-light) */}
              <span
                className="text-light opacity-75 fw-bold"
                style={{ fontSize: "9px", letterSpacing: "3px" }}
              >
                ADMIN DASHBOARD
              </span>
            </div>
          </Link>
        </div>

        {/* --- KANAN: LOGOUT --- */}
        <div>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-bold"
          >
            LOGOUT
          </button>
        </div>

        {/* --- SIDEBAR MENU --- */}
        <div
          className="offcanvas offcanvas-start text-bg-dark"
          id="offcanvasNavbar"
          style={{ maxWidth: "280px" }}
        >
          <div className="offcanvas-header border-bottom border-secondary bg-black bg-opacity-25">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-info d-flex justify-content-center align-items-center fw-bold text-dark"
                style={{ width: "42px", height: "42px" }}
              >
                Z
              </div>
              <div className="d-flex flex-column">
                <h6 className="m-0 text-white fw-bold">Ziro Admin</h6>
                {/* Email dibikin text-light biar gak nyaru */}
                <small
                  className="text-light opacity-50"
                  style={{ fontSize: "11px" }}
                >
                  admin@zirocraft.com
                </small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
            ></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav gap-2 pt-2">
              {/* POLESAN: Link yang gak aktif pake text-light + opacity biar tetep kebaca tapi gak ganggu */}
              <li className="nav-item">
                <NavLink
                  to="/dashboard"
                  onClick={handleClose}
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active fw-bold text-info px-3 bg-info bg-opacity-10 rounded"
                      : "nav-link px-3 text-light opacity-75"
                  }
                >
                  <i className="bi bi-speedometer2 me-2"></i> Dashboard
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/explore"
                  onClick={handleClose}
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active fw-bold text-info px-3 bg-info bg-opacity-10 rounded"
                      : "nav-link px-3 text-light opacity-75"
                  }
                >
                  <i className="bi bi-cart4 me-2"></i> Kasir
                </NavLink>
              </li>

              <li className="nav-item">
                <hr className="border-secondary opacity-50 my-3" />
              </li>
              <div
                className="text-info small fw-bold px-3 mb-2"
                style={{ fontSize: "10px", letterSpacing: "1px" }}
              >
                MANAGEMENT
              </div>

              <li className="nav-item">
                <NavLink
                  to="/category"
                  onClick={handleClose}
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active fw-bold text-info px-3 bg-info bg-opacity-10 rounded"
                      : "nav-link px-3 text-light opacity-75"
                  }
                >
                  <i className="bi bi-grid me-2"></i> Categories
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/items"
                  onClick={handleClose}
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active fw-bold text-info px-3 bg-info bg-opacity-10 rounded"
                      : "nav-link px-3 text-light opacity-75"
                  }
                >
                  <i className="bi bi-box-seam me-2"></i> Products
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/users"
                  onClick={handleClose}
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active fw-bold text-info px-3 bg-info bg-opacity-10 rounded"
                      : "nav-link px-3 text-light opacity-75"
                  }
                >
                  <i className="bi bi-people me-2"></i> Users
                </NavLink>
              </li>
            </ul>
          </div>

          {/* WATERMARK: Dibikin lebih terang (text-secondary ganti text-light) */}
          <div className="p-4 text-center border-top border-secondary">
            <small
              className="text-light opacity-25 fw-bold"
              style={{ fontSize: "9px", letterSpacing: "2px" }}
            >
              ZIROCRAFT STUDIO © 2026
            </small>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
