import React from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // Tambah useLocation
import { Toaster } from "react-hot-toast";

import Menubar from "./components/Menubar/Menubar.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import ManageCategory from "./pages/ManageCategory/ManageCategory.jsx";
import ManageUsers from "./pages/ManageUsers/ManageUsers.jsx";
import ManageItems from "./pages/ManageItems/ManageItems.jsx";
import Explore from "./pages/Explore/Explore.jsx";
import Login from "./pages/Login/Login.jsx"; // Import Login lu

const App = () => {
  const location = useLocation(); // Buat deteksi posisi halaman

  // Cek apakah sekarang lagi di halaman login
  const isLoginPage = location.pathname === "/login";

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />

      {/* SIHIR: Menubar cuma muncul kalau BUKAN di halaman Login */}
      {!isLoginPage && <Menubar />}

      <Routes>
        {/* Route Login Baru */}
        <Route path="/login" element={<Login />} />

        {/* Route Dashboard & Management */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/category" element={<ManageCategory />} />
        <Route path="/users" element={<ManageUsers />} />
        <Route path="/items" element={<ManageItems />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </div>
  );
};

export default App;
