import React, { useState, useContext } from "react";
import "./Explore.css";
import { AppContext } from "../../context/AppContext";
import CategoryList from "../../CategoryList/CategoryList";

const Explore = () => {
  // 1. Ambil data asli dari Context (Bukan dummy lagi)
  const { categories, itemsData } = useContext(AppContext);

  // Gunakan itemsData dari context, jika masih kosong kasih array []
  const productList = itemsData || [];

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  // --- 1. TAMBAH KE KERANJANG ---
  const addToCart = (product) => {
    // Pakai itemID atau id tergantung struktur data Java kamu
    const existingItem = cart.find(
      (item) => (item.itemID || item.id) === (product.itemID || product.id),
    );
    if (existingItem) {
      setCart(
        cart.map((item) =>
          (item.itemID || item.id) === (product.itemID || product.id)
            ? { ...item, qty: item.qty + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // --- 2. KURANGI ITEM ---
  const decreaseQty = (id) => {
    const existingItem = cart.find((item) => (item.itemID || item.id) === id);
    if (existingItem.qty === 1) {
      setCart(cart.filter((item) => (item.itemID || item.id) !== id));
    } else {
      setCart(
        cart.map((item) =>
          (item.itemID || item.id) === id
            ? { ...item, qty: item.qty - 1 }
            : item,
        ),
      );
    }
  };

  // --- 3. HAPUS ITEM ---
  const removeItem = (id) => {
    setCart(cart.filter((item) => (item.itemID || item.id) !== id));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // --- LOGIC FILTERING PRODUK ---
  const filteredProducts = productList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="pos-container text-light">
      <div className="row">
        {/* --- KIRI: ETALASE --- */}
        <div className="col-lg-8 mb-4">
          {/* Header & Search Bar (DIRAPIKAN JADI FULL WIDTH) */}
          <div className="mb-4">
            <h2 className="fw-bold mb-3 border-start border-5 border-info ps-3">
              Cashier
            </h2>

            {/* UPGRADE: Bar Pencarian Full Width Ala Tutorial tapi Style Zirocraft */}
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary py-2"
                placeholder="Search products or category items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="input-group-text bg-warning border-warning">
                <i className="bi bi-funnel-fill text-dark"></i>
              </span>
            </div>
          </div>

          {/* DAFTAR KATEGORI */}
          <CategoryList />

          {/* Grid Produk */}
          <div className="product-grid mt-4">
            {filteredProducts.length === 0 && (
              <div className="text-center text-secondary w-100 py-5">
                <h5>Belum ada produk tersedia.</h5>
                <p>
                  Coba ketik kata kunci lain atau input barang di menu Products.
                </p>
              </div>
            )}

            {filteredProducts.map((item) => (
              <div
                key={item.itemID || item.id}
                className="product-card"
                onClick={() => addToCart(item)}
              >
                <div className="product-img-box">
                  {item.imgUrl ? (
                    <img
                      src={`http://localhost:8080/api/v1.0${item.imgUrl}`}
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
                  <h6 className="fw-bold mb-1 text-truncate">{item.name}</h6>
                  <p className="text-info m-0 fw-bold">
                    Rp {parseInt(item.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- KANAN: KERANJANG (CART) Tetap Sama --- */}
        <div className="col-lg-4">
          {/* ... Kode Cart kamu yang sudah bagus ... */}
          {/* (Tidak saya ubah karena sudah oke) */}
          <div className="cart-sidebar shadow-lg">
            {/* ... teruskan kodingan cart kamu di sini ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
