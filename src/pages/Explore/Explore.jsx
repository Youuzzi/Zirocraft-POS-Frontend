import React, { useState, useContext } from "react";
import "./Explore.css";
import { AppContext } from "../../context/AppContext";
import CategoryList from "../../CategoryList/CategoryList";
import {
  openShift,
  closeShift,
  recordExpense,
} from "../../Service/ShiftService";
import { processCheckout } from "../../Service/OrderService";
import toast from "react-hot-toast";

const Explore = () => {
  const {
    products,
    activeShift,
    setActiveShift,
    settings,
    userName,
    loadData,
  } = useContext(AppContext);

  // --- STATE KASIR ---
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- STATE MODAL ---
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // --- STATE TRANSAKSI ---
  const [tableNumber, setTableNumber] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [actualCash, setActualCash] = useState("");
  const [expenseData, setExpenseData] = useState({ desc: "", amount: "" });
  const [loading, setLoading] = useState(false);

  // --- LOGIC: CART ---
  const addToCart = (product) => {
    if (product.stock <= 0) return toast.error("Stok barang habis, Zi!");
    const exist = cart.find((i) => i.itemId === product.itemId);
    if (exist) {
      setCart(
        cart.map((i) =>
          i.itemId === product.itemId ? { ...i, qty: i.qty + 1 } : i,
        ),
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };
  const updateQty = (id, delta) => {
    setCart(
      cart.map((i) =>
        i.itemId === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i,
      ),
    );
  };
  const removeItem = (id) => setCart(cart.filter((i) => i.itemId !== id));

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const changeAmount = cashReceived ? cashReceived - totalPrice : 0;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "All" || p.categoryName === selectedCategory),
  );

  // --- HANDLER: CHECKOUT & PRINT ---
  const handleFinalCheckout = async (e) => {
    e.preventDefault();
    if (!tableNumber) return toast.error("Nomor meja wajib diisi!");
    if (cashReceived < totalPrice) return toast.error("Uang diterima kurang!");

    setLoading(true);
    try {
      const orderData = {
        tableNumber,
        totalAmount: totalPrice,
        paymentType: "CASH",
        items: cart.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
      };
      const res = await processCheckout(
        orderData,
        localStorage.getItem("email"),
        activeShift.id,
      );
      if (res.data) {
        toast.success("Transaksi Berhasil! 💸");
        setTimeout(() => {
          window.print();
        }, 500); // Trigger Layout Print
        setCart([]);
        setShowCheckoutModal(false);
        setTableNumber("");
        setCashReceived("");
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal checkout.");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS: SHIFT & EXPENSE ---
  const handleStartShift = async (e) => {
    e.preventDefault();
    const openingVal = e.target.opening.value;
    if (!openingVal) return toast.error("Input modal laci dulu!");
    setLoading(true);
    try {
      const res = await openShift({
        userId: localStorage.getItem("email"),
        openingBalance: openingVal,
      });
      if (res.data) {
        setActiveShift(res.data);
        toast.success("Shift Dimulai!");
      }
    } catch (err) {
      toast.error("Gagal buka shift.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndShift = async (e) => {
    e.preventDefault();
    if (!actualCash) return toast.error("Hitung uang laci dulu!");
    setLoading(true);
    try {
      const res = await closeShift({
        shiftId: activeShift.id,
        actualBalance: actualCash,
      });
      if (res.data) {
        alert(
          `SHIFT SELESAI!\n\nSetoran ke Owner: Rp ${(res.data.actualBalance - settings.defaultFloatAmount).toLocaleString()}\nTinggalkan di laci: Rp ${settings.defaultFloatAmount.toLocaleString()}`,
        );
        window.location.reload();
      }
    } catch (err) {
      toast.error("Gagal tutup shift.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await recordExpense({
        shiftId: activeShift.id,
        description: expenseData.desc,
        amount: expenseData.amount,
        userId: localStorage.getItem("email"),
      });
      setShowExpenseModal(false);
      setExpenseData({ desc: "", amount: "" });
      loadData();
      toast.success("Pengeluaran Dicatat!");
    } catch (err) {
      toast.error("Gagal.");
    } finally {
      setLoading(false);
    }
  };

  // --- GEMBOK SHIFT ---
  if (!activeShift || !activeShift.id || activeShift.status !== "OPEN") {
    return (
      <div
        className="pos-container d-flex align-items-center justify-content-center"
        style={{ minHeight: "85vh" }}
      >
        <div
          className="p-5 text-center shadow-lg"
          style={{
            maxWidth: "450px",
            border: "1px solid #333",
            background: "#1a1a1a",
            borderRadius: "24px",
          }}
        >
          <i
            className="bi bi-door-open text-info"
            style={{ fontSize: "3rem" }}
          ></i>
          <h2 className="fw-bold text-white mt-3">OPENING SHIFT</h2>
          <p className="text-secondary small mb-4">
            Halo <b>{userName}</b>, silakan konfirmasi modal laci.
          </p>
          <div className="alert bg-dark border-secondary text-start mb-4 py-2">
            <small className="text-secondary d-block">MODAL SEHARUSNYA:</small>
            <span className="text-info fw-bold fs-5">
              Rp {settings?.defaultFloatAmount?.toLocaleString() || 0}
            </span>
          </div>
          <form onSubmit={handleStartShift}>
            <input
              name="opening"
              type="number"
              className="form-control form-control-lg bg-dark text-white border-secondary text-center mb-3"
              placeholder="Input uang laci..."
              required
            />
            <button
              type="submit"
              className="btn btn-info w-100 fw-bold py-3 shadow"
            >
              MULAI SHIFT
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pos-container text-light">
      {/* MODAL CHECKOUT */}
      {showCheckoutModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content bg-dark border-secondary text-light shadow-lg"
              style={{ borderRadius: "20px" }}
            >
              <div className="modal-header border-secondary p-4 d-flex justify-content-between">
                <h5 className="fw-bold m-0 text-info">KONFIRMASI PEMBAYARAN</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCheckoutModal(false)}
                ></button>
              </div>
              <form onSubmit={handleFinalCheckout}>
                <div className="modal-body p-4">
                  <label className="small fw-bold text-secondary mb-2">
                    NOMOR MEJA
                  </label>
                  <input
                    type="text"
                    className="form-control bg-black text-info fw-bold border-secondary mb-3"
                    placeholder="Contoh: Meja 05"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    required
                  />
                  <div className="p-3 bg-secondary bg-opacity-10 rounded mb-3 text-start">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Tagihan:</span>
                      <span className="fw-bold">
                        Rp {totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between text-info">
                      <span>Kembali:</span>
                      <span className="fw-bold fs-5">
                        Rp {changeAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <label className="small fw-bold text-secondary mb-2">
                    UANG DITERIMA (RP)
                  </label>
                  <input
                    type="number"
                    className="form-control bg-black text-white border-secondary fs-3 py-3 text-center"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={() => setShowCheckoutModal(false)}
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    className="btn btn-info fw-bold px-4"
                    disabled={loading || cashReceived < totalPrice}
                  >
                    BAYAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EXPENSE */}
      {showExpenseModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content bg-dark border-secondary text-light shadow-lg"
              style={{ borderRadius: "20px" }}
            >
              <div className="modal-header border-secondary p-4 d-flex justify-content-between">
                <h5 className="fw-bold m-0 text-warning">CATAT PENGELUARAN</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowExpenseModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveExpense}>
                <div className="modal-body p-4">
                  <input
                    type="text"
                    className="form-control bg-black text-white border-secondary mb-3"
                    placeholder="Keterangan..."
                    value={expenseData.desc}
                    onChange={(e) =>
                      setExpenseData({ ...expenseData, desc: e.target.value })
                    }
                    required
                  />
                  <input
                    type="number"
                    className="form-control bg-black text-info fw-bold border-secondary"
                    placeholder="Nominal..."
                    value={expenseData.amount}
                    onChange={(e) =>
                      setExpenseData({ ...expenseData, amount: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={() => setShowExpenseModal(false)}
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning fw-bold text-dark px-4"
                  >
                    SIMPAN
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CLOSE SHIFT */}
      {showCloseModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content bg-dark border-secondary text-light shadow-lg"
              style={{ borderRadius: "20px" }}
            >
              <div className="modal-header border-secondary p-4 d-flex justify-content-between">
                <h5 className="fw-bold m-0">
                  <i className="bi bi-power text-danger me-2"></i>AKHIRI SHIFT
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCloseModal(false)}
                ></button>
              </div>
              <form onSubmit={handleEndShift}>
                <div className="modal-body p-4 text-start">
                  <p className="text-secondary small mb-4">
                    Hitung seluruh uang tunai yang ada di laci saat ini.
                  </p>
                  <label className="form-label small fw-bold text-info">
                    TOTAL UANG FISIK (RP)
                  </label>
                  <input
                    type="number"
                    className="form-control bg-black text-white border-secondary text-center fw-bold fs-3 py-3"
                    value={actualCash}
                    onChange={(e) => setActualCash(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={() => setShowCloseModal(false)}
                  >
                    BATAL
                  </button>
                  <button type="submit" className="btn btn-danger fw-bold px-4">
                    TUTUP KASIR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* HEADER & MAIN UI */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
            <div className="page-title-section">
              <div className="d-flex align-items-center gap-3 mb-2">
                <h2
                  className="fw-bold m-0 text-white"
                  style={{ letterSpacing: "1px" }}
                >
                  <i className="bi bi-cash-stack me-2 text-info"></i> CASHIER
                </h2>
                <span
                  className="badge rounded-pill bg-info bg-opacity-10 text-info border border-info border-opacity-25"
                  style={{ fontSize: "10px", padding: "5px 12px" }}
                >
                  ● SHIFT ACTIVE
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span
                  className="text-secondary fw-bold"
                  style={{ fontSize: "10px", letterSpacing: "2px" }}
                >
                  {settings?.storeName
                    ? settings.storeName.toUpperCase()
                    : "ZIROSHOP"}{" "}
                  POS
                </span>
                <button
                  className="btn btn-sm rounded-pill ms-2"
                  style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    background: "rgba(255, 193, 7, 0.1)",
                    color: "#ffc107",
                    border: "1px solid rgba(255, 193, 7, 0.2)",
                    padding: "2px 10px",
                  }}
                  onClick={() => setShowExpenseModal(true)}
                >
                  <i className="bi bi-wallet2 me-1"></i> PENGELUARAN
                </button>
                <button
                  className="btn btn-sm rounded-pill ms-1"
                  style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    background: "rgba(220, 53, 69, 0.1)",
                    color: "#dc3545",
                    border: "1px solid rgba(220, 53, 69, 0.2)",
                    padding: "2px 10px",
                  }}
                  onClick={() => setShowCloseModal(true)}
                >
                  <i className="bi bi-power me-1"></i> AKHIRI SHIFT
                </button>
              </div>
            </div>
            <div style={{ width: "350px" }}>
              <div className="input-group shadow-sm">
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
          </div>

          <CategoryList
            onSelect={setSelectedCategory}
            active={selectedCategory}
          />

          <div className="product-grid mt-4">
            {filteredProducts.map((item) => (
              <div
                key={item.itemId}
                className="product-card"
                onClick={() => addToCart(item)}
              >
                <div
                  className="product-img-box"
                  style={{ position: "relative" }}
                >
                  {item.imgUrl ? (
                    <img src={item.imgUrl} alt={item.name} />
                  ) : (
                    <i className="bi bi-cup-hot text-secondary fs-1"></i>
                  )}
                  {item.stock <= 0 && (
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{
                        background: "rgba(0,0,0,0.7)",
                        color: "#ff4d4d",
                        fontWeight: "bold",
                      }}
                    >
                      OUT OF STOCK
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h6 className="text-truncate text-white">{item.name}</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="price m-0">
                      Rp {parseInt(item.price).toLocaleString()}
                    </p>
                    <small
                      className={
                        item.stock < 5
                          ? "text-danger fw-bold"
                          : "text-secondary"
                      }
                    >
                      Sisa: {item.stock}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <div
            className="cart-sidebar shadow-lg sticky-top"
            style={{ top: "90px" }}
          >
            <div className="p-4 border-bottom border-secondary bg-black bg-opacity-10 d-flex justify-content-between align-items-center">
              <h5
                className="fw-bold m-0 text-white"
                style={{ letterSpacing: "1px" }}
              >
                ORDER DETAILS
              </h5>
              <span className="badge rounded-pill bg-info text-dark px-3 fw-bold">
                {cart.length} ITEMS
              </span>
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
                        <h6 className="m-0 fw-bold text-white text-truncate">
                          {item.name}
                        </h6>
                        <small className="text-info fw-bold">
                          Rp {item.price.toLocaleString()}
                        </small>
                      </div>
                      <button
                        className="btn btn-sm text-danger p-0"
                        onClick={() => removeItem(item.itemId)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center bg-dark rounded-pill border border-secondary px-2 py-1">
                        <button
                          className="btn btn-sm text-info fw-bold p-0 px-2"
                          onClick={() => updateQty(item.itemId, -1)}
                        >
                          -
                        </button>
                        <span className="small fw-bold px-2 text-white">
                          {item.qty}
                        </span>
                        <button
                          className="btn btn-sm text-info fw-bold p-0 px-2"
                          onClick={() => updateQty(item.itemId, 1)}
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
                onClick={() => setShowCheckoutModal(true)}
              >
                CHECKOUT NOW <i className="bi bi-arrow-right-short ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STRUK NOTA TERSEMBUNYI */}
      <div
        id="ziro-receipt"
        className="d-none d-print-block"
        style={{
          color: "#000",
          padding: "15px",
          fontFamily: "monospace",
          width: "58mm",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h4 style={{ margin: 0 }}>{settings?.storeName || "ZIROCRAFT"}</h4>
          <small>{new Date().toLocaleString()}</small>
        </div>
        <div
          style={{ borderBottom: "1px dashed #000", margin: "10px 0" }}
        ></div>
        <p style={{ fontSize: "10px", margin: 0 }}>Table: {tableNumber}</p>
        <div style={{ margin: "10px 0" }}>
          {cart.map((i) => (
            <div
              key={i.itemId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <span>
                {i.name} x{i.qty}
              </span>
              <span>{(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div
          style={{ borderBottom: "1px dashed #000", margin: "10px 0" }}
        ></div>
        <div style={{ textAlign: "right" }}>
          <strong>TOTAL: Rp {totalPrice.toLocaleString()}</strong>
        </div>
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "8px" }}>
          Terima Kasih!
        </p>
      </div>
    </div>
  );
};

export default Explore;
