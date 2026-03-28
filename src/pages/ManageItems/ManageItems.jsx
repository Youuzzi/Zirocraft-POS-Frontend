import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchItems, addItem, deleteItem } from "../../Service/ItemService";
import { fetchCategories } from "../../Service/CategoryService";
import toast from "react-hot-toast";
import "../ManageCategory/ManageCategory.css";

const ManageItems = () => {
  // Ambil data dan fungsi pengubahnya dari context
  const { products, setProducts, categories, setCategories } =
    useContext(AppContext);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [resCat, resItems] = await Promise.all([
        fetchCategories(),
        fetchItems(),
      ]);

      // Sekarang setCategories dan setProducts sudah jadi fungsi yang valid
      if (resCat.data) setCategories(resCat.data);
      if (resItems.data) setProducts(resItems.data);
    } catch (err) {
      console.error("ManageItems: Gagal fetch data.", err);
      toast.error("Gagal memuat data produk.");
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
      toast.error("Lengkapi semua data, Zi! ❌");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "item",
      JSON.stringify({
        name: name,
        price: price,
        categoryId: categoryId,
        description: description,
      }),
    );

    try {
      const response = await addItem(formData);
      if (response.status === 201 || response.status === 200) {
        toast.success("Menu Berhasil Disimpan! 🚀");
        loadInitialData(); // Refresh list
        resetForm();
      }
    } catch (err) {
      console.error("ManageItems: Simpan gagal.", err);
      toast.error("Gagal menyimpan produk.");
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
    if (document.getElementById("itemImage"))
      document.getElementById("itemImage").value = "";
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus menu ini secara permanen?")) {
      try {
        await deleteItem(id);
        toast.success("Menu berhasil dihapus!");
        loadInitialData();
      } catch (err) {
        toast.error("Gagal menghapus menu.");
      }
    }
  };

  return (
    <div className="category-container">
      {/* FORM INPUT */}
      <div className="left-column text-light">
        <h2 className="ziro-title">
          {loading ? "Processing..." : "Add New Menu"}
        </h2>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label small fw-bold">NAMA MENU</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">KATEGORI</label>
            <select
              className="form-select bg-dark text-white border-secondary"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">HARGA (Rp)</label>
            <input
              type="number"
              className="form-control bg-dark text-white border-secondary"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">FOTO PRODUK</label>
            <input
              id="itemImage"
              type="file"
              className="form-control bg-dark text-white border-secondary"
              onChange={handleImageChange}
              required
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 rounded"
                style={{ width: "100px", border: "2px solid #0dcaf0" }}
              />
            )}
          </div>
          <button
            type="submit"
            className="btn btn-info w-100 fw-bold py-3 mt-2"
            disabled={loading}
          >
            SAVE TO DATABASE
          </button>
        </form>
      </div>

      {/* TABLE LIST */}
      <div className="right-column text-light">
        <h2 className="ziro-title">Menu List (Real DB)</h2>
        <div className="table-responsive">
          <table className="table table-dark table-hover border-secondary align-middle">
            <thead>
              <tr>
                <th>IMG</th>
                <th>NAME</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-secondary">
                    Belum ada menu di database.
                  </td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr key={item.itemId}>
                    <td>
                      <img
                        src={item.imgUrl}
                        alt=""
                        className="rounded"
                        style={{
                          width: "45px",
                          height: "45px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td className="fw-bold">{item.name}</td>
                    <td>
                      <span className="badge bg-secondary text-info">
                        {item.categoryName}
                      </span>
                    </td>
                    <td className="text-info fw-bold">
                      Rp {parseInt(item.price).toLocaleString()}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-danger border-0"
                        onClick={() => handleDelete(item.itemId)}
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

export default ManageItems;
