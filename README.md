# Zirocraft POS - Frontend Interface 🚀💻

Selamat datang di repository Frontend **Zirocraft POS**, sebuah antarmuka kasir modern yang dirancang untuk efisiensi transaksi dengan estetika minimalis khas **Zirocraft Studio**. Proyek ini merupakan bagian dari ekosistem Fullstack Spring Boot & React.

### 🔗 Related Repository
* **Backend API:** [Zirocraft-POS-Backend](https://github.com/Youuzzi/Zirocraft-POS-Backend)

### 🛠️ Tech Stack
* **React.js 18** (Vite)
* **Bootstrap 5** & **Custom CSS** (Zirocraft Studio Dark Mode Aesthetic)
* **Axios** (Integrasi API dengan Interceptor untuk Token Handling)
* **React Router Dom v6**
* **React Hot Toast** (Notifikasi Real-time)

### ✨ Fitur Unggulan (v1.0 Stable)
* **Interactive Cashier:** Sistem keranjang belanja yang responsif dengan validasi stok *real-time*.
* **Resilient Payment:** Manajemen *Idempotency Key* berbasis `localStorage` untuk menjaga keamanan transaksi saat terjadi gangguan jaringan.
* **Industrial UI/UX:** Dark mode dengan aksen **Cyan (#0dcaf0)** untuk kenyamanan mata saat penggunaan durasi panjang.
* **Smart Stock Alerts:** Indikator visual *"RUNNING OUT"* otomatis jika stok produk di bawah ambang batas (5 unit).
* **Multi-Format Receipt:** Preview struk belanja digital dan optimasi tata letak untuk *Thermal Printer*.

### 🚀 Cara Menjalankan Project
1. **Clone** repository ini:
   ```bash
   git clone [https://github.com/Youuzzi/Zirocraft-POS-Frontend.git](https://github.com/Youuzzi/Zirocraft-POS-Frontend.git)
Install: Jalankan perintah berikut untuk menginstall library:

Bash
npm install
Environment: Pastikan Backend API kamu sudah berjalan di http://localhost:8080.

Run: Jalankan aplikasi dengan perintah:

Bash
npm run dev
Powered by Zirocraft Studio | Aesthetic. Reliability. Performance.
