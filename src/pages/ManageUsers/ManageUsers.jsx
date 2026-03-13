import React, { useState } from "react";
// Kita "pinjam" CSS dari kategori lagi biar desainnya konsisten & Dark Mode
import "../ManageCategory/ManageCategory.css";

const ManageUsers = () => {
  // --- STATE (MEMORI SEMENTARA) ---
  const [users, setUsers] = useState([]); // Daftar user

  // State untuk form input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- FUNGSI: SIMPAN USER ---
  const handleSave = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Mohon lengkapi semua data user!");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: password, // Disimpan tapi nanti tidak kita tampilkan di tabel (rahasia)
      role: "Cashier", // Kita anggap default-nya Kasir
    };

    setUsers([...users, newUser]);

    // Reset Form
    setName("");
    setEmail("");
    setPassword("");
  };

  // --- FUNGSI: HAPUS USER ---
  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="category-container">
      {/* --- KOLOM KIRI: FORM TAMBAH USER --- */}
      <div className="left-column text-light">
        <h2>Add User</h2>
        <form onSubmit={handleSave}>
          {/* Input Nama */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Input Email */}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control bg-dark text-light border-secondary"
              placeholder="budi@ziro.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Input Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control bg-dark text-light border-secondary"
              placeholder="*******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-info w-100 fw-bold">
            <i className="bi bi-person-plus-fill me-2"></i> Save User
          </button>
        </form>
      </div>

      {/* --- KOLOM KANAN: LIST USER --- */}
      <div className="right-column text-light">
        <h2>User List</h2>

        {users.length === 0 ? (
          <div className="alert alert-secondary bg-dark text-light border-secondary">
            <i className="bi bi-info-circle me-2"></i> Belum ada user yang
            ditambahkan.
          </div>
        ) : (
          <table className="table table-dark table-hover border-secondary align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge bg-success text-white">
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
