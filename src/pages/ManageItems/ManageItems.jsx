import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchItems, addItem, deleteItem } from "../../Service/ItemService";
import { fetchCategories } from "../../Service/CategoryService";
import toast from "react-hot-toast";
import "../ManageCategory/ManageCategory.css"; // Reuse CSS yang sudah dipoles

const ManageItems = () => {
  const { products, setProducts, categories, setCategories } =
    useContext(AppContext);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
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
      if (resCat.data) setCategories(resCat.data);
      if (resItems.data) setProducts(resItems.data);
    } catch (err) {
      toast.error("Gagal sinkronisasi data.");
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
    if (!name || !categoryId || !price || !image || !stock) {
      toast.error("Lengkapi data menu, Zi! ❌");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "item",
      JSON.stringify({
        name,
        price,
        categoryId,
        description,
        stock: Number(stock),
      }),
    );

    try {
      const response = await addItem(formData);
      if (response.status === 201 || response.status === 200) {
        toast.success("Menu Berhasil Disimpan! 🚀");
        resetForm();
        loadInitialData();
      }
    } catch (err) {
      toast.error("Gagal simpan ke backend.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setCategoryId("");
    setPrice("");
    setStock("");
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
        toast.success("Menu dihapus! 🗑️");
        loadInitialData();
      } catch (err) {
        toast.error("Gagal hapus.");
      }
    }
  };

  return (
    <div className="category-container">
      {/* --- BAGIAN FORM --- */}
      <div className="left-column">
        <h2 className="ziro-title">{loading ? "SAVING..." : "Add New Menu"}</h2>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label>NAMA MENU / PRODUK</label>
            <input
              type="text"
              className="form-control"
              placeholder="Kopi Hitam..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>HARGA (RP)</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>STOK</label>
              <input
                type="number"
                className="form-control"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label>KATEGORI</label>
            <select
              className="form-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">-- Pilih --</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>FOTO PRODUK</label>
            <input
              id="itemImage"
              type="file"
              className="form-control"
              onChange={handleImageChange}
              required
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 rounded"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  border: "1px solid var(--accent)",
                }}
              />
            )}
          </div>
          <button
            type="submit"
            className="btn btn-info w-100 fw-bold py-3 mt-2 shadow"
            disabled={loading}
          >
            SAVE MENU
          </button>
        </form>
      </div>

      {/* --- BAGIAN TABEL --- */}
      <div className="right-column">
        <h2 className="ziro-title">Menu List</h2>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>IMG</th>
                <th>NAME</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOK</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.itemId}>
                  <td>
                    <img
                      src={item.imgUrl}
                      alt=""
                      className="rounded shadow-sm"
                      style={{
                        width: "45px",
                        height: "45px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td className="product-name">{item.name}</td>
                  <td>
                    <span className="badge bg-secondary bg-opacity-25 text-info">
                      {item.categoryName}
                    </span>
                  </td>
                  <td className="product-price">
                    Rp {parseInt(item.price).toLocaleString()}
                  </td>
                  <td
                    className={
                      item.stock < 5 ? "text-danger fw-bold" : "text-light"
                    }
                  >
                    {item.stock}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm text-danger opacity-75"
                      onClick={() => handleDelete(item.itemId)}
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageItems;
