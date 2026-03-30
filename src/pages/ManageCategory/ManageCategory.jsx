import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import {
  deleteCategory,
  addCategory,
  fetchCategories,
} from "../../Service/CategoryService";
import toast from "react-hot-toast";

import "./ManageCategory.css";

const ManageCategory = () => {
  // 1. Ambil data global dari Context (Agar sinkron dengan Kasir)
  const { categories, setCategories } = useContext(AppContext);

  // 2. State untuk Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- HANDLER: PREVIEW FOTO ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // --- HANDLER: SIMPAN KATEGORI ---
  const handleSave = async (e) => {
    e.preventDefault();

    if (!name || !image) {
      toast.error("Nama kategori dan Gambar wajib ada, Zi! ❌");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      const categoryData = {
        name: name,
        description: description,
        bgColor: "#2c2c2c",
      };

      formData.append("category", JSON.stringify(categoryData));
      formData.append("file", image);

      const response = await addCategory(formData);

      if (response.status === 201 || response.status === 200) {
        // REAKTIF: Ambil data terbaru dari server agar Kasir ikut update
        const resRefresh = await fetchCategories();
        setCategories(resRefresh.data);

        toast.success("Kategori berhasil ditambahkan! 🚀");

        // Reset Form
        setName("");
        setDescription("");
        setImage(null);
        setPreview(null);
        if (document.getElementById("categoryImageInput")) {
          document.getElementById("categoryImageInput").value = "";
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal menambahkan kategori. Cek koneksi Backend!");
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLER: HAPUS KATEGORI ---
  const handleDelete = async (categoryId) => {
    if (
      window.confirm(
        "Yakin mau hapus kategori ini, bro? Semua produk di kategori ini mungkin akan terpengaruh.",
      )
    ) {
      try {
        const response = await deleteCategory(categoryId);
        if (response.status === 204 || response.status === 200) {
          // REAKTIF: Filter data di state global
          setCategories(
            categories.filter(
              (cat) => (cat.categoryId || cat.id) !== categoryId,
            ),
          );
          toast.success("Kategori berhasil dihapus! 🗑️");
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal menghapus kategori.");
      }
    }
  };

  return (
    <div className="category-container">
      {/* --- FORM INPUT (KIRI) --- */}
      <div className="left-column">
        <h2 className="ziro-title">Add Category</h2>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-light">
              CATEGORY NAME
            </label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Contoh: Minuman Dingin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-light">
              DESCRIPTION
            </label>
            <textarea
              className="form-control bg-dark text-white border-secondary"
              placeholder="Penjelasan singkat..."
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-light">
              CATEGORY IMAGE
            </label>
            <input
              id="categoryImageInput"
              type="file"
              accept="image/*"
              className="form-control bg-dark text-white border-secondary"
              onChange={handleImageChange}
              required
            />
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
            className="btn btn-info w-100 fw-bold py-3 mt-2"
            disabled={isLoading}
          >
            {isLoading ? "SAVING..." : "SAVE CATEGORY"}
          </button>
        </form>
      </div>

      {/* --- LIST TABEL (KANAN) --- */}
      <div className="right-column">
        <h2 className="ziro-title">Category List</h2>

        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th className="px-4">#</th>
                <th>IMAGE</th>
                <th>CATEGORY NAME</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-secondary">
                    Belum ada kategori di database.
                  </td>
                </tr>
              ) : (
                categories.map((cat, index) => (
                  <tr key={cat.categoryId || cat.id}>
                    <td className="px-4 text-secondary">{index + 1}</td>
                    <td>
                      {cat.imgUrl ? (
                        <img
                          src={`http://localhost:8080/api/v1.0${cat.imgUrl}`}
                          alt={cat.name}
                          className="rounded shadow-sm"
                          style={{
                            width: "45px",
                            height: "45px",
                            objectFit: "cover",
                            border: "1px solid #333",
                          }}
                        />
                      ) : (
                        <i className="bi bi-image text-muted fs-4"></i>
                      )}
                    </td>
                    <td className="product-name">{cat.name}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm text-danger opacity-75 border-0"
                        onClick={() => handleDelete(cat.categoryId || cat.id)}
                      >
                        <i className="bi bi-trash3-fill"></i>
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

export default ManageCategory;
