import React from "react";
import "./Receipt.css";

const Receipt = ({ orderData, settings, onClose }) => {
  if (!orderData) return null;

  // --- SINKRONISASI DATA (FIXED LOGIC) ---
  // Menghitung total qty item secara dinamis (handle itemName & quantity dari DB)
  const totalItems =
    orderData.items?.reduce(
      (acc, item) => acc + (item.quantity || item.qty || 0),
      0,
    ) || 0;

  // Nama Kasir dari Storage
  const cashierName = (localStorage.getItem("name") || "Admin").toUpperCase();

  // Nama Toko Uppercase
  const storeNameDisplay = (settings?.storeName || "ZIROSHOP").toUpperCase();

  // Format Nomor Antrean: Gunakan queueNumber dari DB
  const queueNumberDisplay = String(orderData.queueNumber || 1).padStart(
    3,
    "0",
  );

  // LOGIK TANGGAL: Prioritaskan date dari Snapshot, fallback ke createdAt
  const displayDate =
    orderData.date ||
    (orderData.createdAt
      ? new Date(orderData.createdAt).toLocaleString("id-ID")
      : "-");

  const handlePrint = () => {
    window.print();
  };

  const dashedLine = { borderBottom: "1px dashed #000", margin: "8px 0" };

  return (
    <div className="receipt-overlay">
      {/* ========================================================
          BAGIAN 1: DIGITAL VIEW (PREMIUM CARD - FULL INFO)
          ======================================================== */}
      <div className="digital-receipt-card no-print animate__animated animate__fadeInUp">
        <div className="receipt-content-scroll">
          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                background: "#f0fdfa",
                color: "#0dcaf0",
                borderRadius: "15px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto 15px",
                fontSize: "24px",
              }}
            >
              <i className="bi bi-patch-check-fill"></i>
            </div>
            <h4 style={{ fontWeight: "800", margin: 0 }}>{storeNameDisplay}</h4>
            <p style={{ fontSize: "11px", color: "#888", margin: "4px 0" }}>
              Pandeglang, Banten
            </p>
            <p style={{ fontSize: "10px", color: "#888", margin: "0" }}>
              IG: @yoozev_ | WA: 0812-XXXX
            </p>
          </div>

          {/* QUEUE & STATUS BADGE */}
          <div
            style={{
              background: "#f8f9fa",
              borderRadius: "20px",
              padding: "20px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "#aaa",
                fontWeight: "700",
                textTransform: "uppercase",
              }}
            >
              Nomor Antrean
            </span>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "900",
                color: "#1a1a1a",
                margin: "5px 0",
              }}
            >
              {queueNumberDisplay}
            </h1>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginTop: "15px",
                textAlign: "left",
                borderTop: "1px solid #eee",
                paddingTop: "15px",
              }}
            >
              <div>
                <small style={{ color: "#888", fontSize: "10px" }}>
                  NO. NOTA
                </small>
                <div style={{ fontSize: "11px", fontWeight: "700" }}>
                  {orderData.orderNumber}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <small style={{ color: "#888", fontSize: "10px" }}>
                  STATUS
                </small>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    color: "#0dcaf0",
                  }}
                >
                  {orderData.status === "COMPLETED" ||
                  orderData.status === "PAID"
                    ? "LUNAS / PAID"
                    : "PENDING"}
                </div>
              </div>
              <div>
                <small style={{ color: "#888", fontSize: "10px" }}>WAKTU</small>
                <div style={{ fontSize: "11px", fontWeight: "700" }}>
                  {displayDate}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <small style={{ color: "#888", fontSize: "10px" }}>KASIR</small>
                <div style={{ fontSize: "11px", fontWeight: "700" }}>
                  {cashierName}
                </div>
              </div>
              <div>
                <small style={{ color: "#888", fontSize: "10px" }}>MEJA</small>
                <div style={{ fontSize: "11px", fontWeight: "700" }}>
                  {orderData.tableNumber || "-"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <small style={{ color: "#888", fontSize: "10px" }}>CUST</small>
                <div style={{ fontSize: "11px", fontWeight: "800" }}>
                  {orderData.customerName?.toUpperCase() || "CUSTOMER"}
                </div>
              </div>
            </div>
          </div>

          {/* ITEMS LIST */}
          <div style={{ marginBottom: "20px" }}>
            <small
              style={{ color: "#aaa", fontWeight: "700", fontSize: "10px" }}
            >
              RINCIAN PESANAN
            </small>
            <div style={{ marginTop: "12px" }}>
              {orderData.items?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: "700" }}>
                      {(item.itemName || item.name || "MENU").toUpperCase()}
                    </div>
                    <div style={{ fontSize: "11px", color: "#888" }}>
                      {item.quantity || item.qty} x Rp{" "}
                      {(item.price || 0).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: "700" }}>
                    Rp{" "}
                    {(
                      item.subTotal || item.price * (item.quantity || item.qty)
                    ).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
                borderTop: "1px dashed #eee",
                paddingTop: "10px",
              }}
            >
              <span
                style={{ fontSize: "12px", color: "#666", fontWeight: "700" }}
              >
                TOTAL ITEM:
              </span>
              <span style={{ fontSize: "12px", fontWeight: "700" }}>
                {totalItems}
              </span>
            </div>
          </div>

          {/* FINANCIALS */}
          <div style={{ borderTop: "2px solid #f8f9fa", paddingTop: "15px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: "700" }}>
                TOTAL BILL
              </span>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "900",
                  color: "#0dcaf0",
                }}
              >
                Rp {orderData.totalAmount?.toLocaleString()}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#666",
              }}
            >
              <span>Tunai</span>{" "}
              <span>Rp {Number(orderData.cash || 0).toLocaleString()}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#666",
              }}
            >
              <span>Kembalian</span>{" "}
              <span>Rp {orderData.change?.toLocaleString() || 0}</span>
            </div>
          </div>

          {/* QR SECTION */}
          <div style={{ textAlign: "center", margin: "25px 0" }}>
            <div
              style={{
                width: "70px",
                height: "70px",
                border: "1.5px solid #eee",
                borderRadius: "12px",
                margin: "0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "8px",
                color: "#ccc",
                fontWeight: "bold",
              }}
            >
              QR VERIFIED
            </div>
            <p
              style={{
                fontSize: "10px",
                color: "#bbb",
                marginTop: "10px",
                marginBottom: 0,
              }}
            >
              Scan untuk riwayat pesanan
            </p>
          </div>

          {/* FOOTER POLICIES */}
          <div style={{ textAlign: "center", fontSize: "10px", color: "#aaa" }}>
            <p style={{ margin: 0 }}>* Barang yang sudah dibeli *</p>
            <p style={{ margin: 0 }}>* tidak dapat dikembalikan *</p>
            <p
              style={{
                marginTop: "15px",
                fontWeight: "800",
                color: "#ddd",
                letterSpacing: "2px",
              }}
            >
              THANK YOU
            </p>
            <p style={{ fontSize: "8px", color: "#eee", marginTop: "5px" }}>
              Powered by Zirocraft Studio
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "20px 25px",
            background: "#f8f9fa",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={handlePrint}
            className="btn btn-warning w-100 fw-bold py-2"
            style={{ borderRadius: "12px" }}
          >
            <i className="bi bi-printer-fill me-2"></i>PRINT
          </button>
          <button
            onClick={onClose}
            className="btn btn-dark w-100 fw-bold py-2"
            style={{ borderRadius: "12px" }}
          >
            DONE
          </button>
        </div>
      </div>

      {/* ========================================================
          BAGIAN 2: THERMAL VIEW (CENTER ON PRINT)
          ======================================================== */}
      <div id="ziro-thermal-receipt">
        <div style={{ textAlign: "center" }}>
          <h3 style={{ margin: "0", fontSize: "14pt", fontWeight: "bold" }}>
            {storeNameDisplay}
          </h3>
          <p style={{ margin: "2px 0", fontSize: "8pt" }}>Pandeglang, Banten</p>
          <p style={{ margin: "0", fontSize: "7pt" }}>
            IG: @yoozev_ | WA: 0812-XXXX
          </p>
          <div style={dashedLine}></div>
          <p style={{ margin: "5px 0 0 0", fontSize: "9pt" }}>NO. ANTREAN</p>
          <h1 style={{ margin: "0", fontSize: "32pt", fontWeight: "bold" }}>
            {queueNumberDisplay}
          </h1>
          <div style={dashedLine}></div>
        </div>

        <div style={{ fontSize: "8pt", marginBottom: "10px" }}>
          <div className="thermal-flex">
            <span>No. Nota :</span> <span>{orderData.orderNumber}</span>
          </div>
          <div className="thermal-flex" style={{ fontWeight: "bold" }}>
            <span>STATUS :</span> <span>LUNAS / PAID</span>
          </div>
          <div className="thermal-flex">
            <span>Waktu :</span> <span>{displayDate}</span>
          </div>
          <div className="thermal-flex">
            <span>Kasir :</span> <span>{cashierName}</span>
          </div>
          <div className="thermal-flex">
            <span>Meja :</span> <span>{orderData.tableNumber || "-"}</span>
          </div>
          <div className="thermal-flex">
            <span>Cust :</span>{" "}
            <span style={{ fontWeight: "bold" }}>
              {orderData.customerName?.toUpperCase() || "CUSTOMER"}
            </span>
          </div>
          <div style={dashedLine}></div>
        </div>

        <div style={{ fontSize: "9pt" }}>
          {orderData.items?.map((item, index) => (
            <div key={index} style={{ marginBottom: "6px" }}>
              <div style={{ textTransform: "uppercase", fontWeight: "bold" }}>
                {item.itemName || item.name || "MENU"}
              </div>
              <div className="thermal-flex">
                <span>
                  {item.quantity || item.qty} x{" "}
                  {(item.price || 0).toLocaleString()}
                </span>
                <span>
                  {(
                    item.subTotal || item.price * (item.quantity || item.qty)
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          <div className="thermal-flex" style={{ marginTop: "5px" }}>
            <span>TOTAL ITEM:</span> <span>{totalItems}</span>
          </div>
          <div style={dashedLine}></div>
        </div>

        <div style={{ fontSize: "10pt" }}>
          <div className="thermal-flex" style={{ fontWeight: "bold" }}>
            <span>TOTAL BILL:</span>{" "}
            <span>Rp {orderData.totalAmount?.toLocaleString()}</span>
          </div>
          <div className="thermal-flex">
            <span>Tunai :</span>{" "}
            <span>{Number(orderData.cash || 0).toLocaleString()}</span>
          </div>
          <div className="thermal-flex" style={{ fontWeight: "bold" }}>
            <span>Kembali :</span>{" "}
            <span>{orderData.change?.toLocaleString() || 0}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0",
          }}
        >
          <div
            style={{
              width: "30mm",
              height: "30mm",
              border: "1px solid #000",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "7pt",
              textAlign: "center",
            }}
          >
            QR VERIFICATION
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: "7pt" }}>
          <p style={{ margin: 0, fontSize: "7pt" }}>
            Scan untuk riwayat pesanan
          </p>
          <div style={dashedLine}></div>
          <p style={{ margin: 0 }}>* Barang yang sudah dibeli *</p>
          <p style={{ margin: 0 }}>* tidak dapat dikembalikan *</p>
          <p style={{ marginTop: "10px", fontSize: "9pt", fontWeight: "bold" }}>
            TERIMA KASIH
          </p>
          <p style={{ fontSize: "6pt", opacity: 0.5, marginTop: "5px" }}>
            Powered by Zirocraft Studio
          </p>
        </div>
        <div style={{ height: "40px" }}></div>
      </div>
    </div>
  );
};

export default Receipt;
