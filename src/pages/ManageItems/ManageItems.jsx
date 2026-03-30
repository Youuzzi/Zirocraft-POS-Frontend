import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchItems, addItem, deleteItem } from "../../Service/ItemService";
import { fetchCategories } from "../../Service/CategoryService";
import api from "../../Service/api";
import toast from "react-hot-toast";
import "../ManageCategory/ManageCategory.css";

const ManageItems = () => {
  // FIX: Ambil loadData (bukan loadInitialData)
  const { products, categories, loadData, isDataLoaded } =
    useContext(AppContext);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Gunakan loadData dari context saat halaman pertama kali dibuka
  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.itemId);
    setName(item.name);
    setPrice(item.price);
    setStock(item.stock);
    setCategoryId(item.categoryId);
    setDescription(item.description);
    setPreview(item.imgUrl);
    window.scrollTo(0, 0);
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
    setLoading(true);
    const formData = new FormData();
    if (image) formData.append("file", image);
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
      if (isEditing) {
        await api.put(`/admin/items/${editId}`, formData);
        toast.success("Item Berhasil Diupdate! 📦");
      } else {
        await addItem(formData);
        toast.success("Menu Berhasil Disimpan! 🚀");
      }
      resetForm();
      loadData(); // Refresh data global
    } catch (err) {
      toast.error("Gagal simpan ke database.");
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
    setIsEditing(false);
    setEditId(null);
    if (document.getElementById("itemImage"))
      document.getElementById("itemImage").value = "";
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus menu ini secara permanen?")) {
      try {
        await deleteItem(id);
        toast.success("Menu dihapus! 🗑️");
        loadData();
      } catch (err) {
        toast.error("Gagal hapus.");
      }
    }
  };

  // Tampilkan loading jika data context belum siap
  if (!isDataLoaded)
    return (
      <div className="category-container">
        <p className="text-info">Loading Database...</p>
      </div>
    );

  return (
    <div className="category-container">
      <div className="left-column">
        <h2 className="ziro-title">
          {isEditing ? "EDIT / RESTOK MENU" : "ADD NEW MENU"}
        </h2>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="small fw-bold text-light">NAMA MENU</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nama..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="small fw-bold text-light">HARGA (RP)</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="small fw-bold text-light">STOK</label>
              <input
                type="number"
                className="form-control text-info fw-bold"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="small fw-bold text-light">KATEGORI</label>
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
            <label className="small fw-bold text-light">FOTO PRODUK</label>
            <input
              id="itemImage"
              type="file"
              className="form-control"
              onChange={handleImageChange}
              required={!isEditing}
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
                  border: "1px solid #0dcaf0",
                }}
              />
            )}
          </div>
          <button
            type="submit"
            className="btn btn-info w-100 fw-bold py-3 shadow"
            disabled={loading}
          >
            {loading
              ? "SAVING..."
              : isEditing
                ? "UPDATE DATA"
                : "SAVE TO DATABASE"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary w-100 mt-2"
              onClick={resetForm}
            >
              BATAL EDIT
            </button>
          )}
        </form>
      </div>

      <div className="right-column">
        <h2 className="ziro-title">Menu List</h2>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>IMG</th>
                <th>NAME</th>
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
                  <td className="product-price">
                    Rp {parseInt(item.price).toLocaleString()}
                  </td>
                  <td className={item.stock < 5 ? "text-danger fw-bold" : ""}>
                    {item.stock}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm text-info me-2 border-0 bg-transparent"
                      onClick={() => handleEdit(item)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-sm text-danger border-0 bg-transparent"
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
