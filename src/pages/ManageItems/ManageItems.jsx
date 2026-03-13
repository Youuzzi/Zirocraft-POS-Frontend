import React, { useState } from "react";
// Pastikan path CSS ini benar sesuai folder kamu
import "../ManageCategory/ManageCategory.css";

const ManageItems = () => {
  // --- DATA DUMMY KATEGORI (Pura-pura dari Database) ---
  // Nanti bagian ini kita ganti pakai data asli dari Backend Java
  const dummyCategories = [
    { id: 1, name: "Minuman (Coffee)" },
    { id: 2, name: "Makanan Berat" },
    { id: 3, name: "Snack & Dessert" },
    { id: 4, name: "Topping & Add-ons" },
  ];

  // --- MEMORI SEMENTARA (STATE) ---
  const [products, setProducts] = useState([]);

  // State untuk form input
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(""); // <--- STATE BARU UNTUK KATEGORI
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // --- FUNGSI: MENGURUS UPLOAD FOTO ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // --- FUNGSI: SIMPAN PRODUK ---
  const handleSave = (e) => {
    e.preventDefault();

    // Validasi: Kategori juga wajib diisi sekarang!
    if (!name || !categoryId || !price || !stock) {
      alert("Mohon lengkapi semua data (termasuk Kategori)!");
      return;
    }

    // Mencari nama kategori berdasarkan ID yang dipilih (Untuk tampilan di tabel aja)
    const selectedCategory = dummyCategories.find((c) => c.id == categoryId);

    const newProduct = {
      id: Date.now(),
      name: name,
      categoryName: selectedCategory ? selectedCategory.name : "Unknown", // Simpan nama kategorinya
      price: price,
      stock: stock,
      imgUrl: preview,
    };

    setProducts([...products, newProduct]);

    // Reset Form setelah save
    setName("");
    setCategoryId(""); // Reset dropdown
    setPrice("");
    setStock("");
    setImage(null);
    setPreview(null);
  };

  // --- FUNGSI: HAPUS PRODUK ---
  const handleDelete = (id) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  return (
    <div className="category-container">
      {/* --- KOLOM KIRI: FORM --- */}
      <div className="left-column text-light">
        <h2>Add Product</h2>
        <form onSubmit={handleSave}>
          {/* INPUT NAMA PRODUK */}
          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Contoh: Kopi Susu"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* --- INPUT KATEGORI (YANG BARU DITAMBAHKAN) --- */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">-- Select Category --</option>
              {dummyCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* INPUT HARGA */}
          <div className="mb-3">
            <label className="form-label">Price (Rp)</label>
            <input
              type="number"
              className="form-control bg-dark text-light border-secondary"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* INPUT STOK */}
          <div className="mb-3">
            <label className="form-label">Stock</label>
            <input
              type="number"
              className="form-control bg-dark text-light border-secondary"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          {/* INPUT FOTO */}
          <div className="mb-3">
            <label className="form-label">Product Image</label>
            <input
              type="file"
              className="form-control bg-dark text-light border-secondary"
              onChange={handleImageChange}
            />
            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: "100px", borderRadius: "5px" }}
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-info w-100 fw-bold">
            <i className="bi bi-box-seam me-2"></i> Save Product
          </button>
        </form>
      </div>

      {/* --- KOLOM KANAN: LIST PRODUK --- */}
      <div className="right-column text-light">
        <h2>Product List</h2>

        {products.length === 0 ? (
          <div className="alert alert-secondary bg-dark text-light border-secondary">
            <i className="bi bi-info-circle me-2"></i> Belum ada produk.
          </div>
        ) : (
          <table className="table table-dark table-hover border-secondary align-middle">
            <thead>
              <tr>
                <th>Img</th>
                <th>Name</th>
                <th>Category</th> {/* Kolom Baru */}
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.imgUrl ? (
                      <img
                        src={item.imgUrl}
                        alt={item.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    ) : (
                      <div
                        className="bg-secondary rounded"
                        style={{ width: "40px", height: "40px" }}
                      ></div>
                    )}
                  </td>
                  <td className="fw-bold">{item.name}</td>
                  <td>
                    {/* Badge Kategori biar keren */}
                    <span className="badge bg-secondary text-info border border-secondary">
                      {item.categoryName}
                    </span>
                  </td>
                  <td>Rp {parseInt(item.price).toLocaleString()}</td>
                  <td>{item.stock}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(item.id)}
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

export default ManageItems;
