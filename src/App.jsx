import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppContext } from "./context/AppContext";

// --- IMPORT COMPONENTS ---
import Menubar from "./components/Menubar/Menubar.jsx";

// --- IMPORT PAGES ---
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/Login/Login.jsx";
import Explore from "./pages/Explore/Explore.jsx";
import ManageCategory from "./pages/ManageCategory/ManageCategory.jsx";
import ManageItems from "./pages/ManageItems/ManageItems.jsx";
import ManageUsers from "./pages/ManageUsers/ManageUsers.jsx";
import ManageSettings from "./pages/ManageSettings/ManageSettings.jsx";

const App = () => {
  const { token } = useContext(AppContext);
  const location = useLocation();

  // 1. Ambil Role untuk proteksi halaman
  const role = localStorage.getItem("role");

  const isLoginPage = location.pathname === "/login";

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      {token && !isLoginPage && <Menubar />}

      <Routes>
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Jalur Masuk: Admin ke Dashboard, User ke Explore (Kasir) */}
        <Route
          path="/"
          element={
            token ? (
              role === "ROLE_ADMIN" ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/explore" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Dashboard & Kasir (Bisa diakses siapa saja yang login) */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/explore"
          element={token ? <Explore /> : <Navigate to="/login" />}
        />

        {/* --- PROTEKSI ADMIN (Hanya ROLE_ADMIN yang bisa lewat) --- */}
        <Route
          path="/category"
          element={
            token && role === "ROLE_ADMIN" ? (
              <ManageCategory />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/items"
          element={
            token && role === "ROLE_ADMIN" ? (
              <ManageItems />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/users"
          element={
            token && role === "ROLE_ADMIN" ? (
              <ManageUsers />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/settings"
          element={
            token && role === "ROLE_ADMIN" ? (
              <ManageSettings />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
