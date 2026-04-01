import React, { useState, useContext, useEffect } from "react";
import "./Explore.css";
import { AppContext } from "../../context/AppContext";
import CategoryList from "../../CategoryList/CategoryList";
import {
  openShift,
  closeShift,
  recordExpense,
} from "../../Service/ShiftService";
import { processCheckout } from "../../Service/OrderService";
import Receipt from "../../components/Receipt/Receipt";
import toast from "react-hot-toast";

const formatIDR = (value) => {
  if (!value || isNaN(value)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const Explore = () => {
  const {
    products,
    activeShift,
    setActiveShift,
    settings,
    userName,
    loadData,
    isDataLoaded,
  } = useContext(AppContext);

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrderData, setLastOrderData] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [actualCash, setActualCash] = useState("");
  const [expenseData, setExpenseData] = useState({ desc: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [openingInput, setOpeningInput] = useState("");
  const [paymentType, setPaymentType] = useState("CASH");

  // --- LOGIC MASTER AUDIT: PERSISTENT IDEMPOTENCY KEY ---
  const [idempotencyKey, setIdempotencyKey] = useState("");

  const subTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const serviceCharge = Math.round(subTotal * 0.05);
  const taxAmount = Math.round((subTotal + serviceCharge) * 0.11);
  const rawTotal = subTotal + serviceCharge + taxAmount;
  const grandTotal = Math.round(rawTotal / 500) * 500;
  const changeAmount = cashReceived ? cashReceived - grandTotal : 0;

  const addToCart = (product) => {
    if (product.stock <= 0) return toast.error("Stok habis!");
    const exist = cart.find((i) => i.itemId === product.itemId);
    if (exist)
      setCart(
        cart.map((i) =>
          i.itemId === product.itemId ? { ...i, qty: i.qty + 1 } : i,
        ),
      );
    else setCart([...cart, { ...product, qty: 1 }]);
  };

  const updateQty = (id, delta) =>
    setCart(
      cart.map((i) =>
        i.itemId === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i,
      ),
    );

  const removeItem = (id) => setCart(cart.filter((i) => i.itemId !== id));

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === "All" || p.categoryName === selectedCategory),
  );

  // --- LOGIC BARU: BUKA MODAL GENERATE PERSISTENT KEY ---
  const handleOpenCheckout = () => {
    let savedKey = localStorage.getItem("pending_idempotency_key");
    if (!savedKey) {
      savedKey = crypto.randomUUID();
      localStorage.setItem("pending_idempotency_key", savedKey);
    }
    setIdempotencyKey(savedKey);
    setShowCheckoutModal(true);
  };

  // --- LOGIC BARU: TUTUP MODAL RESET KEY ---
  const handleCloseCheckout = () => {
    if (!loading) {
      localStorage.removeItem("pending_idempotency_key");
      setIdempotencyKey("");
      setShowCheckoutModal(false);
    }
  };

  const handleFinalCheckout = async (e) => {
    e.preventDefault();
    if (paymentType === "CASH" && cashReceived < grandTotal)
      return toast.error("Uang kurang!");

    setLoading(true);
    const orderData = {
      customerName: customerName || "Walk-in",
      tableNumber,
      totalAmount: grandTotal,
      paymentType,
      idempotencyKey,
      items: cart.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
    };

    try {
      const res = await processCheckout(
        orderData,
        localStorage.getItem("email"),
        activeShift.id,
      );
      if (res.data) {
        // SUKSES: Reset Kunci
        localStorage.removeItem("pending_idempotency_key");
        setIdempotencyKey("");

        setLastOrderData({
          ...res.data,
          cash: paymentType === "QRIS" ? grandTotal : cashReceived,
          change: paymentType === "QRIS" ? 0 : cashReceived - grandTotal,
          date: new Date().toLocaleString("id-ID"),
        });
        setShowReceipt(true);
        setCart([]);
        setCustomerName("");
        setTableNumber("");
        setCashReceived("");
        setShowCheckoutModal(false);
        loadData();
        toast.success("Transaksi Berhasil!");
      }
    } catch (err) {
      // ERROR JANGAN RESET: Biar kalau diklik ulang UUID tetap sama & ditolak double bill oleh Backend
      toast.error(err.response?.data?.error || "Gagal memproses pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartShift = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await openShift({
        userId: localStorage.getItem("email"),
        openingBalance: openingInput,
      });
      if (res.data) {
        setActiveShift(res.data);
        toast.success("Shift Dimulai!");
      }
    } catch (err) {
      toast.error("Gagal.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndShift = async (e) => {
    e.preventDefault();
    if (!window.confirm("Akhiri shift & Logout?")) return;
    setLoading(true);
    try {
      const res = await closeShift({
        shiftId: activeShift.id,
        actualBalance: actualCash,
      });
      if (res.data) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (err) {
      toast.error("Gagal.");
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
      toast.success("Dicatat!");
    } catch (err) {
      toast.error("Gagal.");
    } finally {
      setLoading(false);
    }
  };

  if (!isDataLoaded)
    return (
      <div className="pos-container d-flex align-items-center justify-content-center">
        <div className="spinner-border text-info"></div>
      </div>
    );

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
          <div className="alert bg-dark border-secondary text-start mb-4 py-2 mt-3">
            <small className="text-secondary d-block">MODAL SEHARUSNYA:</small>
            <span className="text-info fw-bold fs-5">
              Rp {settings?.defaultFloatAmount?.toLocaleString() || 0}
            </span>
          </div>
          <form onSubmit={handleStartShift}>
            <input
              name="opening"
              type="number"
              className="form-control form-control-lg bg-dark text-white text-center mb-1"
              placeholder="0"
              onChange={(e) => setOpeningInput(e.target.value)}
              required
            />
            <div className="text-info small fw-bold text-center mb-3">
              Konfirmasi: {formatIDR(openingInput)}
            </div>
            <button
              type="submit"
              className="btn btn-info w-100 fw-bold py-3 shadow"
              disabled={loading}
            >
              {loading ? "PROCESSING..." : "MULAI SHIFT"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pos-container text-light">
      {showReceipt && lastOrderData && (
        <Receipt
          orderData={lastOrderData}
          settings={settings}
          onClose={() => setShowReceipt(false)}
        />
      )}

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
                  onClick={handleCloseCheckout}
                ></button>
              </div>
              <form onSubmit={handleFinalCheckout}>
                <div className="modal-body p-4">
                  <div className="row mb-3">
                    <div className="col-md-8">
                      <label className="small fw-bold text-secondary">
                        NAMA PELANGGAN
                      </label>
                      <input
                        type="text"
                        className="form-control bg-black text-white border-secondary"
                        placeholder="Nama..."
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-secondary">
                        MEJA
                      </label>
                      <input
                        type="text"
                        className="form-control bg-black text-info text-center border-secondary fw-bold"
                        placeholder="00"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setPaymentType("CASH")}
                      className={`btn w-100 fw-bold ${paymentType === "CASH" ? "btn-info" : "btn-outline-secondary text-light"}`}
                    >
                      CASH
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType("QRIS")}
                      className={`btn w-100 fw-bold ${paymentType === "QRIS" ? "btn-info" : "btn-outline-secondary text-light"}`}
                    >
                      QRIS / DEBIT
                    </button>
                  </div>

                  <div
                    className="p-3 bg-secondary bg-opacity-10 rounded mb-3 text-start"
                    style={{ fontSize: "13px" }}
                  >
                    <div className="d-flex justify-content-between mb-1">
                      <span>Subtotal:</span>
                      <span className="fw-bold">
                        Rp {subTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-1 opacity-75">
                      <span>Service (5%):</span>
                      <span>Rp {serviceCharge.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1 opacity-75">
                      <span>Tax (11%):</span>
                      <span>Rp {taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between text-info border-top border-secondary pt-2 mt-2">
                      <span className="fw-bold">GRAND TOTAL:</span>
                      <span className="fw-bold fs-5">
                        Rp {grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {paymentType === "CASH" && (
                    <>
                      <label className="small fw-bold text-secondary mb-2 text-uppercase">
                        UANG TUNAI (RP)
                      </label>
                      <input
                        type="number"
                        className="form-control bg-black text-white border-secondary fs-3 py-3 text-center mb-1"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        required
                        autoFocus
                      />
                      <div className="text-info small fw-bold text-center mb-1">
                        Terinput: {formatIDR(cashReceived)}
                      </div>
                      <div className="text-warning small fw-bold text-center mb-3">
                        Kembali: {formatIDR(changeAmount)}
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={handleCloseCheckout}
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    className="btn btn-info fw-bold px-4"
                    disabled={
                      loading ||
                      (paymentType === "CASH" && cashReceived < grandTotal)
                    }
                  >
                    {loading ? "SAVING..." : "BAYAR"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showExpenseModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.8)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content bg-dark border-secondary text-light shadow-lg"
              style={{ borderRadius: "15px" }}
            >
              <div className="modal-header border-secondary">
                <h5 className="fw-bold m-0 text-warning">CATAT PENGELUARAN</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowExpenseModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveExpense}>
                <div className="modal-body p-4">
                  <div className="mb-3 text-start">
                    <label className="small fw-bold text-secondary mb-2">
                      DESKRIPSI
                    </label>
                    <input
                      type="text"
                      className="form-control bg-black text-white border-secondary"
                      placeholder="Beli es batu..."
                      value={expenseData.desc}
                      onChange={(e) =>
                        setExpenseData({ ...expenseData, desc: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3 text-start">
                    <label className="small fw-bold text-secondary mb-2">
                      NOMINAL (RP)
                    </label>
                    <input
                      type="number"
                      className="form-control bg-black text-white border-secondary fs-4 py-2 mb-1"
                      value={expenseData.amount}
                      onChange={(e) =>
                        setExpenseData({
                          ...expenseData,
                          amount: e.target.value,
                        })
                      }
                      required
                    />
                    <div className="text-warning small fw-bold text-center mt-2">
                      Konfirmasi: {formatIDR(expenseData.amount)}
                    </div>
                  </div>
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
                    className="btn btn-warning fw-bold px-4"
                  >
                    SIMPAN
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showCloseModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.8)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content bg-dark border-secondary text-light shadow-lg"
              style={{ borderRadius: "20px" }}
            >
              <div className="modal-header border-secondary">
                <h5 className="fw-bold m-0 text-danger">CLOSE SESSION</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowCloseModal(false)}
                ></button>
              </div>
              <form onSubmit={handleEndShift}>
                <div className="modal-body p-4 text-center">
                  <p className="text-secondary small">
                    Input total uang fisik di laci saat ini.
                  </p>
                  <label className="small fw-bold text-secondary mb-2">
                    TOTAL FISIK (RP)
                  </label>
                  <input
                    type="number"
                    className="form-control bg-black text-white border-secondary fs-3 py-3 text-center"
                    value={actualCash}
                    onChange={(e) => setActualCash(e.target.value)}
                    required
                  />
                  <div className="text-info small fw-bold text-center mt-2">
                    Terinput: {formatIDR(actualCash)}
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCloseModal(false)}
                  >
                    BATAL
                  </button>
                  <button type="submit" className="btn btn-danger fw-bold px-4">
                    TUTUP SHIFT & KELUAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                  {settings?.storeName?.toUpperCase() || "ZIROSHOP"} POS
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
                  PENGELUARAN
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
                  AKHIRI SHIFT
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
                onClick={() => item.stock > 0 && addToCart(item)}
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
                  {item.stock <= 0 ? (
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
                  ) : item.stock < 5 ? (
                    <div
                      className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark shadow-sm"
                      style={{ fontSize: "10px", fontWeight: "800" }}
                    >
                      RUNNING OUT
                    </div>
                  ) : null}
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
                          ? "text-warning fw-bold"
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
              {cart.map((item) => (
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
                        className="btn btn-sm text-info fw-bold px-2"
                        onClick={() => updateQty(item.itemId, -1)}
                      >
                        -
                      </button>
                      <span className="small fw-bold px-2 text-white">
                        {item.qty}
                      </span>
                      <button
                        className="btn btn-sm text-info fw-bold px-2"
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
              ))}
            </div>
            <div className="cart-footer p-4">
              <div className="mb-3 border-bottom border-secondary border-opacity-25 pb-3">
                <div
                  className="d-flex justify-content-between text-secondary mb-1"
                  style={{ fontSize: "12px" }}
                >
                  <span>Subtotal</span>
                  <span>Rp {subTotal.toLocaleString()}</span>
                </div>
                <div
                  className="d-flex justify-content-between text-secondary mb-1"
                  style={{ fontSize: "11px", opacity: 0.7 }}
                >
                  <span>Service (5%)</span>
                  <span>Rp {serviceCharge.toLocaleString()}</span>
                </div>
                <div
                  className="d-flex justify-content-between text-secondary"
                  style={{ fontSize: "11px", opacity: 0.7 }}
                >
                  <span>PPN (11%)</span>
                  <span>Rp {taxAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="d-flex justify-content-between mb-4 align-items-center">
                <span className="fw-bold text-white">TOTAL BILL</span>
                <span className="total-price-text">
                  Rp {grandTotal.toLocaleString()}
                </span>
              </div>
              <button
                className="btn-pay py-3 shadow"
                disabled={cart.length === 0}
                onClick={handleOpenCheckout}
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
