// --- FILE: src/pages/ManageCategory/ManageCategory.jsx ---
import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { deleteCategory, addCategory } from "../../Service/CategoryService"; // Pastikan addCategory sudah ada di file ini
// import toast from "react-hot-toast"; // Hapus '//' di awal kalau kamu sudah install toast

import "./ManageCategory.css";

const ManageCategory = () => {
  // 1. Tarik Data dari Backend (Context)
  const { categories, setCategories } = useContext(AppContext);

  // 2. Memori Form (State)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- FUNGSI: MENGURUS PREVIEW FOTO SAAT DIPILIH ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Bikin URL sementara buat nampilin foto
    }
  };

  // --- FUNGSI: SIMPAN KATEGORI KE BACKEND ---
  const handleSave = async (e) => {
    e.preventDefault();

    // Validasi kalau kosong
    if (!name || !image) {
      alert("Nama kategori dan Gambar wajib diisi, bro!");
      return;
    }

    setIsLoading(true);

    try {
      // Karena kita ngirim File (Gambar), kita harus pakai FormData (Bukan JSON biasa)
      const formData = new FormData();

      // Data teks (nama & deskripsi) harus di-stringify sesuai aturan backend di tutorial
      const categoryData = {
        name: name,
        description: description,
        bgColor: "#2c2c2c", // Warna default kalau butuh
      };

      // Masukkan ke paketan form
      formData.append("category", JSON.stringify(categoryData)); // Data teks
      formData.append("file", image); // File fotonya

      // Panggil API Backend
      const response = await addCategory(formData);

      // Kalau sukses (Status 201 Created)
      if (response.status === 201) {
        // Tambahkan data baru ke layar tanpa perlu reload page
        setCategories([...categories, response.data]);

        // toast.success("Kategori berhasil ditambahkan!"); // Aktifkan kalau pakai toast
        alert("Sukses! Kategori berhasil ditambahkan!"); // Hapus alert ini kalau pakai toast

        // Bersihkan Form setelah sukses
        setName("");
        setDescription("");
        setImage(null);
        setPreview(null);

        // Reset input file (Sedikit trik DOM)
        document.getElementById("categoryImageInput").value = "";
      }
    } catch (error) {
      console.error(error);
      // toast.error("Gagal menambahkan kategori."); // Aktifkan kalau pakai toast
      alert("Gagal menambahkan kategori.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNGSI: HAPUS KATEGORI ---
  const handleDelete = async (categoryId) => {
    try {
      const response = await deleteCategory(categoryId);
      if (response.status === 204) {
        setCategories(
          categories.filter((cat) => (cat.categoryId || cat.id) !== categoryId),
        );
        // toast.success("Kategori berhasil dihapus!");
      }
    } catch (error) {
      console.error(error);
      // toast.error("Gagal menghapus kategori.");
    }
  };

  return (
    <div className="category-container">
      {/* --- KOLOM KIRI: FORM INPUT --- */}
      <div className="left-column text-light">
        <h2>Add Category</h2>
        <form onSubmit={handleSave}>
          {/* Input Nama */}
          <div className="mb-3">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Contoh: Minuman Dingin"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Input Deskripsi (Opsional) */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control bg-dark text-light border-secondary"
              placeholder="Penjelasan singkat..."
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Input Foto */}
          <div className="mb-3">
            <label className="form-label">Category Image</label>
            <input
              id="categoryImageInput"
              type="file"
              accept="image/*"
              className="form-control bg-dark text-light border-secondary"
              onChange={handleImageChange}
            />
            {/* Tampilkan Preview Foto kalau sudah pilih file */}
            {preview && (
              <div className="mt-3 text-center">
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    border: "2px solid #0dcaf0",
                  }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-info w-100 fw-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2"></span>{" "}
                Processing...
              </span>
            ) : (
              <span>
                <i className="bi bi-save me-2"></i> Save Category
              </span>
            )}
          </button>
        </form>
      </div>

      {/* --- KOLOM KANAN: DAFTAR KATEGORI --- */}
      <div className="right-column text-light">
        <h2>Category List</h2>

        {categories.length === 0 ? (
          <div className="alert alert-secondary bg-dark text-light border-secondary">
            <i className="bi bi-info-circle me-2"></i> Belum ada kategori yang
            ditambahkan.
          </div>
        ) : (
          <table className="table table-dark table-hover border-secondary">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Image</th>
                <th scope="col">Category Name</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat.categoryId || cat.id}>
                  <th scope="row" className="align-middle">
                    {index + 1}
                  </th>
                  <td className="align-middle">
                    {cat.imgUrl ? (
                      <img
                        src={`http://localhost:8080/api/v1.0${cat.imgUrl}`}
                        alt={cat.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    ) : (
                      <i className="bi bi-image text-muted fs-4"></i>
                    )}
                  </td>
                  <td className="align-middle">{cat.name}</td>
                  <td className="align-middle">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(cat.categoryId || cat.id)}
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

export default ManageCategory;
