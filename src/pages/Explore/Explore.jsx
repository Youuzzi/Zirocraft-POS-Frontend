import React, { useState, useContext } from "react";
import "./Explore.css";
import { AppContext } from "../../context/AppContext";
import CategoryList from "../../CategoryList/CategoryList";

const Explore = () => {
  const { products } = useContext(AppContext);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.itemId === product.itemId);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.itemId === product.itemId
            ? { ...item, qty: item.qty + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(
      cart.map((item) => {
        if (item.itemId === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : item;
        }
        return item;
      }),
    );
  };

  const removeItem = (id) => setCart(cart.filter((item) => item.itemId !== id));

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="pos-container text-light">
      <div className="row g-4">
        {/* --- AREA KIRI --- */}
        <div className="col-lg-8">
          {/* HEADER AREA: CLEAN & FUNCTIONAL */}
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
            <div className="page-title-section">
              <h2
                className="fw-bold m-0 d-flex align-items-center text-white"
                style={{ letterSpacing: "1px" }}
              >
                <i className="bi bi- cash-stack me-3 text-info"></i>
                CASHIER
              </h2>
              <div className="d-flex align-items-center gap-2 mt-1">
                <span
                  className="text-secondary fw-bold"
                  style={{ fontSize: "10px", letterSpacing: "2px" }}
                >
                  TRANSACTION MODULE
                </span>
                <span
                  className="badge bg-dark text-secondary border border-secondary border-opacity-25"
                  style={{ fontSize: "9px" }}
                >
                  READY
                </span>
              </div>
            </div>

            {/* SEARCH BOX */}
            <div className="search-wrapper" style={{ width: "350px" }}>
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-dark border-secondary text-secondary">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary py-2"
                  placeholder="Cari menu atau scan barcode..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <CategoryList
            onSelect={setSelectedCategory}
            active={selectedCategory}
          />

          {/* GRID PRODUK */}
          <div className="product-grid mt-4">
            {filteredProducts.map((item) => (
              <div
                key={item.itemId}
                className="product-card"
                onClick={() => addToCart(item)}
              >
                <div className="product-img-box">
                  {item.imgUrl ? (
                    <img src={item.imgUrl} alt={item.name} />
                  ) : (
                    <i className="bi bi-cup-hot text-secondary fs-1"></i>
                  )}
                </div>
                <div className="product-info">
                  <h6>{item.name}</h6>
                  <p className="price">
                    Rp {parseInt(item.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- AREA KANAN (ORDER DETAILS) --- */}
        <div className="col-lg-4">
          <div
            className="cart-sidebar shadow-lg sticky-top"
            style={{ top: "90px" }}
          >
            <div className="p-4 border-bottom border-secondary bg-black bg-opacity-10">
              <div className="d-flex justify-content-between align-items-center">
                <h5
                  className="fw-bold m-0 text-white"
                  style={{ letterSpacing: "1px" }}
                >
                  ORDER DETAILS
                </h5>
                <span className="badge rounded-pill bg-info text-dark px-3 fw-bold shadow-sm">
                  {cart.length} ITEMS
                </span>
              </div>
            </div>

            <div className="cart-items-container">
              {cart.length === 0 ? (
                <div className="text-center py-5 opacity-25">
                  <i className="bi bi-cart-x" style={{ fontSize: "4rem" }}></i>
                  <p className="mt-2 fw-bold">Belum Ada Pesanan</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.itemId} className="cart-item-row p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div style={{ flex: 1 }}>
                        <h6
                          className="m-0 fw-bold text-white text-truncate"
                          style={{ maxWidth: "160px" }}
                        >
                          {item.name}
                        </h6>
                        <small className="text-info fw-bold">
                          Rp {item.price.toLocaleString()}
                        </small>
                      </div>
                      <button
                        className="btn btn-sm text-danger p-0 opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.itemId);
                        }}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center bg-dark rounded-pill border border-secondary px-2 py-1">
                        <button
                          className="btn btn-sm text-info fw-bold p-0 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQty(item.itemId, -1);
                          }}
                        >
                          -
                        </button>
                        <span className="small fw-bold px-2 text-white">
                          {item.qty}
                        </span>
                        <button
                          className="btn btn-sm text-info fw-bold p-0 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQty(item.itemId, 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                      <span className="fw-bold text-light small">
                        Rp {(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer p-4">
              <div className="d-flex justify-content-between mb-2 text-secondary small fw-bold">
                <span>SUBTOTAL</span>
                <span>Rp {totalPrice.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-4 align-items-center">
                <span className="fw-bold text-white">TOTAL BILL</span>
                <span className="total-price-text">
                  Rp {totalPrice.toLocaleString()}
                </span>
              </div>
              <button
                className="btn-pay py-3 shadow"
                disabled={cart.length === 0}
              >
                CHECKOUT NOW <i className="bi bi-arrow-right-short ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
