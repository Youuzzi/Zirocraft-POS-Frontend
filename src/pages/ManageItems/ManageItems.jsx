import React, { useState, useEffect } from "react";
import axios from "axios";
import "../ManageCategory/ManageCategory.css";

const ManageItems = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // State Form
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // URL API sesuai tutorial Bushan (Sesuaikan port jika berbeda)
  const API_BASE_URL = "http://localhost:8080/api/version1.0";

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const resCat = await axios.get(`${API_BASE_URL}/categories`);
      const resItems = await axios.get(`${API_BASE_URL}/items`);

      setCategories(resCat.data);
      setProducts(resItems.data);
    } catch (err) {
      console.error("Gagal mengambil data dari DB:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !categoryId || !price || !image) {
      alert("Lengkapi semua data, Zi!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);
    // Bagian ini harus JSON stringify sesuai standar @RequestPart di Spring Boot
    formData.append(
      "item",
      JSON.stringify({
        name: name,
        price: price,
        categoryID: categoryId, // Kirim ID Kategori yang dipilih
        description: description,
      }),
    );

    try {
      await axios.post(`${API_BASE_URL}/admin/items`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Menu Makanan Berhasil Disimpan!");
      fetchInitialData(); // Refresh daftar menu di tabel kanan
      resetForm();
    } catch (err) {
      console.error("Gagal simpan produk:", err);
      alert("Gagal konek ke Backend!");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setCategoryId("");
    setPrice("");
    setDescription("");
    setImage(null);
    setPreview(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus menu ini dari database?")) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/items/${id}`);
        fetchInitialData();
      } catch (err) {
        console.error("Gagal hapus:", err);
      }
    }
  };

  return (
    <div className="category-container">
      {/* FORM INPUT MENU */}
      <div className="left-column text-light">
        <h2>{loading ? "Saving..." : "Add New Menu"}</h2>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label">Menu Name</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                /* PAKAI cat.category_id SESUAI DB KAMU */
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Price (Rp)</label>
            <input
              type="number"
              className="form-control bg-dark text-light border-secondary"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Photo</label>
            <input
              type="file"
              className="form-control bg-dark text-light border-secondary"
              onChange={handleImageChange}
              required
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "100px",
                  marginTop: "10px",
                  borderRadius: "8px",
                }}
              />
            )}
          </div>

          <button
            type="submit"
            className="btn btn-info w-100 fw-bold"
            disabled={loading}
          >
            {loading ? "Processing..." : "Save to Database"}
          </button>
        </form>
      </div>

      {/* DAFTAR MENU DARI DATABASE */}
      <div className="right-column text-light">
        <h2>Menu List (Real DB)</h2>
        <table className="table table-dark table-hover border-secondary">
          <thead>
            <tr>
              <th>Img</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.item_id}>
                <td>
                  <img
                    src={item.img_url}
                    alt=""
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                </td>
                <td>{item.name}</td>
                <td>
                  <span className="badge bg-secondary text-info">
                    {item.category_name}
                  </span>
                </td>
                <td>Rp {item.price?.toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.item_id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageItems;
