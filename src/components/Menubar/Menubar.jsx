import React from "react";
import { assets } from "../../assets/assets";
import { Link, NavLink } from "react-router-dom";

const Menubar = () => {
  // --- FUNGSI BARU: TUTUP MENU SECARA MANUAL ---
  const handleClose = () => {
    // Kita cari tombol "X" (Close) yang ada di header menu
    const closeBtn = document.querySelector(".offcanvas-header .btn-close");
    // Kalau ketemu, kita suruh dia "klik diri sendiri" biar menu tertutup
    if (closeBtn) {
      closeBtn.click();
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark shadow-sm py-3 sticky-top">
      <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
        {/* --- KIRI: TOGGLER + LOGO --- */}
        <div className="d-flex align-items-center gap-3">
          <button
            className="navbar-toggler border-0 p-0 focus-ring focus-ring-dark"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            style={{ display: "block" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <Link to="/" className="navbar-brand d-flex align-items-center me-0">
            <img
              src={assets.favicon}
              alt="Ziro"
              width="28"
              height="28"
              className="d-inline-block"
            />
            <div
              className="ms-2 d-flex flex-column"
              style={{ lineHeight: "1" }}
            >
              <span className="fw-bold fs-3 text-white tracking-wide">
                Ziro
              </span>
              <span
                className="text-secondary fw-medium"
                style={{ fontSize: "10px", letterSpacing: "2px" }}
              >
                ADMIN
              </span>
            </div>
          </Link>
        </div>

        {/* --- KANAN: LOGOUT --- */}
        <div>
          <Link
            to="/"
            className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-bold"
          >
            Logout
          </Link>
        </div>

        {/* --- SIDEBAR MENU --- */}
        <div
          className="offcanvas offcanvas-start text-bg-dark"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          style={{ maxWidth: "280px" }}
        >
          {/* HEADER PROFIL */}
          <div className="offcanvas-header border-bottom border-secondary bg-black bg-opacity-25">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-info d-flex justify-content-center align-items-center fw-bold text-dark shadow"
                style={{ width: "42px", height: "42px", fontSize: "18px" }}
              >
                A
              </div>
              <div className="d-flex flex-column">
                <h6 className="m-0 text-white fw-bold">Administrator</h6>
                <small className="text-secondary" style={{ fontSize: "11px" }}>
                  admin@ziro.com
                </small>
              </div>
            </div>

            {/* Tombol Close Asli (Penting: Class 'btn-close' dipakai oleh handleClose) */}
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          {/* LIST LINK MENU */}
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-start flex-grow-1 gap-3 pt-3">
              <li className="nav-item">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active fw-bold text-info px-3 bg-secondary bg-opacity-10 rounded"
                      : "nav-link px-3"
                  }
                  onClick={handleClose} // <--- GANTI data-bs-dismiss DENGAN INI
                >
                  <i className="bi bi-speedometer2 me-2"></i> Dashboard
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/explore"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active fw-bold text-info px-3 bg-secondary bg-opacity-10 rounded"
                      : "nav-link px-3"
                  }
                  onClick={handleClose} // <--- GANTI INI
                >
                  <i className="bi bi-cart4 me-2"></i> Kasir
                </NavLink>
              </li>

              <li className="nav-item">
                <hr className="text-secondary my-1 opacity-50" />
              </li>
              <div
                className="text-secondary small fw-bold px-3 mt-2 mb-1"
                style={{ fontSize: "11px", letterSpacing: "1px" }}
              >
                DATA MASTER
              </div>

              <li className="nav-item">
                <NavLink
                  to="/category"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active fw-bold text-info px-3 bg-secondary bg-opacity-10 rounded"
                      : "nav-link px-3"
                  }
                  onClick={handleClose} // <--- GANTI INI
                >
                  <i className="bi bi-grid me-2"></i> Categories
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/items"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active fw-bold text-info px-3 bg-secondary bg-opacity-10 rounded"
                      : "nav-link px-3"
                  }
                  onClick={handleClose} // <--- GANTI INI
                >
                  <i className="bi bi-box-seam me-2"></i> Products
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active fw-bold text-info px-3 bg-secondary bg-opacity-10 rounded"
                      : "nav-link px-3"
                  }
                  onClick={handleClose} // <--- GANTI INI
                >
                  <i className="bi bi-people me-2"></i> Users
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
