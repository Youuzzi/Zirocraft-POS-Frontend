import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppContext } from "./context/AppContext";

// --- IMPORT COMPONENTS ---
import Menubar from "./components/Menubar/Menubar.jsx";

// --- IMPORT PAGES ---
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/Login/Login.jsx";
import Explore from "./pages/Explore/Explore.jsx"; // INI YANG TADI HILANG, ZI!
import ManageCategory from "./pages/ManageCategory/ManageCategory.jsx";
import ManageItems from "./pages/ManageItems/ManageItems.jsx";
import ManageUsers from "./pages/ManageUsers/ManageUsers.jsx";

const App = () => {
  const { token } = useContext(AppContext);
  const location = useLocation();

  // Cek apakah sekarang lagi di halaman login
  const isLoginPage = location.pathname === "/login";

  return (
    <div>
      {/* Notifikasi Toast Global */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Menubar muncul hanya jika user sudah login DAN tidak sedang di page login */}
      {token && !isLoginPage && <Menubar />}

      <Routes>
        {/* 1. Halaman Login: Kalau sudah login, jangan boleh buka login lagi (lempar ke dashboard) */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* 2. Jalur Akar (/): Kalau blm login ke /login, kalau sudah ke /dashboard */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* 3. Dashboard: Proteksi (Hanya jika sudah login) */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* 4. Kasir (Explore): Proteksi */}
        <Route
          path="/explore"
          element={token ? <Explore /> : <Navigate to="/login" />}
        />

        {/* 5. Management Pages: Proteksi */}
        <Route
          path="/category"
          element={token ? <ManageCategory /> : <Navigate to="/login" />}
        />
        <Route
          path="/items"
          element={token ? <ManageItems /> : <Navigate to="/login" />}
        />
        <Route
          path="/users"
          element={token ? <ManageUsers /> : <Navigate to="/login" />}
        />

        {/* 6. Catch-all: Jika ngetik URL ngawur, lempar ke dashboard atau login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
