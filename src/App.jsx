import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios"; // Tambahkan ini

import Menubar from "./components/Menubar/Menubar.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import ManageCategory from "./pages/ManageCategory/ManageCategory.jsx";
import ManageUsers from "./pages/ManageUsers/ManageUsers.jsx";
import ManageItems from "./pages/ManageItems/ManageItems.jsx";
import Explore from "./pages/Explore/Explore.jsx";

const App = () => {
  // --- INTERCEPTOR: Asisten Pembawa Token ---
  useEffect(() => {
    // 1. Ambil Token Bos Zirocraft yang tadi lu pakai di Postman!
    // GANTI TULISAN DI BAWAH INI SAMA TOKEN ASLI LU DARI POSTMAN:
    const tokenBosZirocraft =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJleHAiOjE3NzQ1MTU3NzAsImlhdCI6MTc3NDQ3OTc3MH0.849DJBd5t4s_YBqWWlt4LKRn5SzG76w8dBWaFOljz9U";

    // 2. Suruh Axios otomatis bawa token ini tiap kali nembak API
    axios.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${tokenBosZirocraft}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }, []);
  // ------------------------------------------

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Menubar />
      <Routes>
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
