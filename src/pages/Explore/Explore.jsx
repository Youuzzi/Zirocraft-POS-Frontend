import React, { useState, useContext } from "react";
import "./Explore.css";
import { AppContext } from "../../context/AppContext";
import CategoryList from "../../CategoryList/CategoryList";

const Explore = () => {
  const { categories, products } = useContext(AppContext);

  // Cek data di Console (F12)
  console.log("Cek Kategori:", categories);
  console.log("Cek Produk:", products);

  // Jika products belum siap/masih loading, pakai array kosong [] biar gak error
  const productList = products || [];

  // ------------------------------------------------------

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  // --- 1. TAMBAH KE KERANJANG (Lewat Klik Produk) ---
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // --- 2. KURANGI ITEM (Tombol Minus) ---
  const decreaseQty = (id) => {
    const existingItem = cart.find((item) => item.id === id);
    if (existingItem.qty === 1) {
      setCart(cart.filter((item) => item.id !== id)); // Hapus kalau sisa 1
    } else {
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item,
        ),
      );
    }
  };

  // --- 3. KETIK JUMLAH MANUAL ---
  const handleManualQty = (id, value) => {
    const newQty = parseInt(value);
    if (!value || isNaN(newQty) || newQty < 1) {
      return;
    }
    setCart(
      cart.map((item) => (item.id === id ? { ...item, qty: newQty } : item)),
    );
  };

  // --- 4. HAPUS ITEM (Tombol Sampah) ---
  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Hitung Total
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Filter Produk Berdasarkan Search
  const filteredProducts = productList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="pos-container text-light">
      <div className="row">
        {/* --- KIRI: ETALASE --- */}
        <div className="col-lg-8 mb-4">
          {/* Header & Search Bar */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold m-0 border-start border-5 border-info ps-3">
              Cashier
            </h2>
            <div className="input-group w-50">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Cari menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* 👇👇 [BARU] DAFTAR KATEGORI MUNCUL DI SINI 👇👇 */}
          <CategoryList />
          {/* 👆👆 --------------------------------------- 👆👆 */}

          {/* Grid Produk */}
          <div className="product-grid">
            {/* Tampilkan Pesan jika Produk Kosong */}
            {filteredProducts.length === 0 && (
              <div className="text-center text-secondary w-100 py-5">
                <h5>Belum ada produk tersedia.</h5>
                <p>Pastikan kamu sudah input barang di menu Products.</p>
              </div>
            )}

            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="product-card"
                onClick={() => addToCart(item)}
              >
                <div className="product-img-box">
                  {/* Cek jika ada URL gambar, jika tidak pakai icon gelas */}
                  {item.imgUrl ? (
                    <img
                      src={item.imgUrl}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <i className="bi bi-cup-hot-fill"></i>
                  )}
                </div>
                <div className="p-3">
                  <h6 className="fw-bold mb-1">{item.name}</h6>
                  <p className="text-info m-0 fw-bold">
                    Rp {parseInt(item.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- KANAN: KERANJANG (CART) --- */}
        <div className="col-lg-4">
          <div className="cart-sidebar shadow-lg">
            <div className="p-3 border-bottom border-secondary bg-dark rounded-top">
              <h5 className="m-0 fw-bold">
                <i className="bi bi-cart3 me-2"></i> Current Order
              </h5>
            </div>

            <div
              className={`cart-items ${cart.length === 0 ? "cart-hidden" : ""}`}
            >
              {cart.length === 0 ? (
                <div className="text-center text-secondary mt-5">
                  <i className="bi bi-basket display-1 opacity-25"></i>
                  <p className="mt-3">Keranjang kosong</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2"
                  >
                    {/* Nama & Harga Satuan */}
                    <div style={{ flex: 1 }}>
                      <h6 className="m-0 text-truncate">{item.name}</h6>
                      <small className="text-secondary">
                        @ Rp {parseInt(item.price).toLocaleString()}
                      </small>
                    </div>

                    {/* Kontrol Jumlah */}
                    <div className="d-flex align-items-center gap-1">
                      <button
                        className="btn btn-sm btn-dark border-secondary text-danger"
                        onClick={() => decreaseQty(item.id)}
                      >
                        <i className="bi bi-dash"></i>
                      </button>

                      <input
                        type="number"
                        className="form-control form-control-sm bg-dark text-light text-center border-secondary p-0"
                        style={{ width: "45px", height: "30px" }}
                        value={item.qty}
                        onChange={(e) =>
                          handleManualQty(item.id, e.target.value)
                        }
                      />

                      <button
                        className="btn btn-sm btn-dark border-secondary text-success"
                        onClick={() => addToCart(item)}
                      >
                        <i className="bi bi-plus"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-danger ms-2"
                        onClick={() => removeItem(item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Subtotal</span>
                <span className="fw-bold">
                  Rp {totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-secondary">Tax (10%)</span>
                <span className="fw-bold">
                  Rp {(totalPrice * 0.1).toLocaleString()}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-4 fs-4 fw-bold text-white border-top border-secondary pt-3">
                <span>Total</span>
                <span className="text-info">
                  Rp {(totalPrice * 1.1).toLocaleString()}
                </span>
              </div>

              <button
                className="btn btn-info w-100 py-2 fw-bold text-dark fs-5 shadow"
                disabled={cart.length === 0}
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
