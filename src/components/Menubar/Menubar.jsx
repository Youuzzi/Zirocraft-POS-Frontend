import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Menubar = () => {
  const navigate = useNavigate();
  // --- LOGIKA REAKTIF: Ambil data dari Context agar Reaktif ---
  const { setToken, setUserName, userName, settings } = useContext(AppContext);

  const role = localStorage.getItem("role");
  const userEmail = localStorage.getItem("email") || "user@ziro.com";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : "Z";

  // --- FUNGSI LOGOUT ---
  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserName("Administrator");
    toast.success("Logout Berhasil!");
    navigate("/login");
  };

  // --- FUNGSI TUTUP MENU ---
  const handleClose = () => {
    const closeBtn = document.querySelector(".offcanvas-header .btn-close");
    if (closeBtn) closeBtn.click();
  };

  return (
    <nav className="navbar navbar-dark bg-dark shadow-sm py-3 sticky-top">
      <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
        {/* --- KIRI: BRANDING --- */}
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
              {/* --- LOGIKA NAMA TOKO DINAMIS: TETAP PAKE STYLE SPAN ORIGINAL --- */}
              <span
                className="fw-bold fs-4 text-white"
                style={{ letterSpacing: "1px", textTransform: "uppercase" }}
              >
                {settings?.storeName ? (
                  <>
                    {/* Jika nama toko lebih dari 4 huruf, kita bagi warnanya biar gaya Zirocraft tetep dapet */}
                    {settings.storeName.length > 4 ? (
                      <>
                        {settings.storeName.substring(
                          0,
                          settings.storeName.length - 4,
                        )}
                        <span style={{ color: "#0dcaf0" }}>
                          {settings.storeName.substring(
                            settings.storeName.length - 4,
                          )}
                        </span>
                      </>
                    ) : (
                      <span style={{ color: "#0dcaf0" }}>
                        {settings.storeName}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    ZIRO<span style={{ color: "#0dcaf0" }}>SHOP</span>
                  </>
                )}
              </span>
              <span
                className="text-light opacity-75 fw-bold"
                style={{ fontSize: "9px", letterSpacing: "3px" }}
              >
                {role === "ROLE_ADMIN" ? "ADMIN DASHBOARD" : "CASHIER SYSTEM"}
              </span>
            </div>
          </Link>
        </div>

        {/* --- KANAN: LOGOUT --- */}
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-bold"
        >
          LOGOUT
        </button>

        {/* --- SIDEBAR MENU --- */}
        <div
          className="offcanvas offcanvas-start text-bg-dark"
          id="offcanvasNavbar"
          style={{ maxWidth: "280px" }}
        >
          <div className="offcanvas-header border-bottom border-secondary bg-black bg-opacity-25">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-info d-flex justify-content-center align-items-center fw-bold text-dark shadow"
                style={{ width: "42px", height: "42px" }}
              >
                {userInitial}
              </div>
              <div className="d-flex flex-column">
                <h6 className="m-0 text-white fw-bold">{userName}</h6>
                <small
                  className="text-light opacity-50"
                  style={{ fontSize: "11px" }}
                >
                  {userEmail}
                </small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
            ></button>
          </div>

          <div className="offcanvas-body d-flex flex-column">
            <ul className="navbar-nav gap-2 pt-2 flex-grow-1">
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

              {/* LOGIKA ROLE ADMIN */}
              {role === "ROLE_ADMIN" && (
                <>
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
                  <li className="nav-item">
                    <NavLink
                      to="/settings"
                      onClick={handleClose}
                      className={({ isActive }) =>
                        isActive
                          ? "nav-link active fw-bold text-info px-3 bg-info bg-opacity-10 rounded"
                          : "nav-link px-3 text-light opacity-75"
                      }
                    >
                      <i className="bi bi-gear me-2"></i> Store Settings
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            {/* --- WATERMARK SIGNATURE (BAGIAN YANG TIDAK BOLEH HILANG) --- */}
            <div
              className="p-4 text-center border-top border-secondary mt-auto"
              style={{ background: "rgba(0,0,0,0.1)" }}
            >
              <div className="d-flex flex-column align-items-center">
                <div
                  className="mb-1"
                  style={{
                    color: "#0dcaf0",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  &lt; <span style={{ color: "#fff" }}>Z</span> &gt;
                </div>
                <span
                  className="fw-bold text-white"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  ziro<span style={{ color: "#0dcaf0" }}>craft</span> studio
                </span>
                <small
                  className="text-light opacity-25 mt-1"
                  style={{ fontSize: "9px" }}
                >
                  zirocraftid@gmail.com
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
