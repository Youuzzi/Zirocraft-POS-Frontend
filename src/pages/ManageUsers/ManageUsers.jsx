import React, { useState, useEffect } from "react";
import {
  fetchUsers,
  registerUser,
  deleteUser,
} from "../../Service/UserService";
import toast from "react-hot-toast";
import "../ManageCategory/ManageCategory.css"; // Pake CSS yang sama biar konsisten

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); // Default role
  const [loading, setLoading] = useState(false);

  // --- 1. AMBIL DATA DARI DB SAAT HALAMAN DIBUKA ---
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetchUsers();
      if (response.data) setUsers(response.data);
    } catch (error) {
      console.error("Gagal ambil user:", error);
      toast.error("Gagal ambil daftar user dari server.");
    }
  };

  // --- 2. FUNGSI SIMPAN USER BARU ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Lengkapi data user, Zi! ❌");
      return;
    }

    setLoading(true);
    try {
      const userData = { name, email, password, role };
      await registerUser(userData);

      toast.success("User baru berhasil ditambahkan! 🚀");

      // Reset Form & Refresh List
      setName("");
      setEmail("");
      setPassword("");
      setRole("USER");
      loadUsers();
    } catch (error) {
      console.error("Gagal register:", error);
      toast.error("Gagal tambah user. Mungkin email sudah terdaftar?");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. FUNGSI HAPUS USER ---
  const handleDelete = async (userId) => {
    if (window.confirm("Yakin mau hapus user ini dari ZiroShop?")) {
      try {
        await deleteUser(userId);
        toast.success("User berhasil dihapus! 🗑️");
        loadUsers(); // Refresh daftar
      } catch (error) {
        console.error("Gagal hapus user:", error);
        toast.error("Gagal menghapus user.");
      }
    }
  };

  return (
    <div className="category-container">
      {/* KOLOM KIRI: FORM */}
      <div className="left-column text-light">
        <h2 className="ziro-title">Add User</h2>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">Cashier (User)</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-info w-100 fw-bold"
            disabled={loading}
          >
            {loading ? "Processing..." : "Save User"}
          </button>
        </form>
      </div>

      {/* KOLOM KANAN: TABEL */}
      <div className="right-column text-light">
        <h2 className="ziro-title">User List</h2>
        <div className="table-responsive">
          <table className="table table-dark table-hover border-secondary align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-secondary">
                    Belum ada user di database.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.userId}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge ${user.role === "ADMIN" ? "bg-danger" : "bg-success"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(user.userId)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
