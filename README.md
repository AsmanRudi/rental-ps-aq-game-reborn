<div align="center">

# 🎮 AQ GAME REBORN 🎮
### *The Ultimate Modern PlayStation Rental & Gaming Lounge Platform*

<img src="https://img.shields.io/badge/Stack-MERN%20(MongoDB%2C%20Express%2C%20React%2C%20Node)-indigo?style=for-the-badge&logo=react" alt="MERN Stack" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
<img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge" alt="Status" />

</div>

<br>

**AQ Game Reborn** adalah platform web aplikasi manajemen rental PlayStation modern berbasis **MERN Stack** yang dirancang untuk mengatasi berbagai masalah operasional di tempat rental konvensional. Aplikasi ini menyediakan sistem pemesanan online real-time, manajemen billing dinamis, verifikasi pembayaran QRIS, hingga dasbor kasir *walk-in* offline.

---

## ✨ Fitur Utama (Core Features)

### 👤 1. Sisi Pengguna / Publik (User Dashboard)
* **Live Slot Visualizer**: Cek ketersediaan jam secara real-time (Slot hijau = Kosong, Merah = Terisi).
* **Dynamic Console Selection**: Filter unit console berdasarkan tipe (`PS5`, `PS4`, `PS3`) lengkap dengan informasi tarif billing per jam.
* **Instant Booking & QRIS Payment**: Sistem pemesanan mandiri dengan simulasi pembayaran QRIS barkod dan upload bukti transfer.
* **WhatsApp Auto-Chat**: Tombol konfirmasi otomatis langsung terhubung ke WhatsApp Admin.
* **Riwayat & E-Receipt**: Pelanggan dapat memantau status pesanan (Pending, Paid, Confirmed) dan mencetak struk digital thermal.

### 🛡️ 2. Sisi Administrator & Kasir (Admin Dashboard)
* **Financial Analytics & Omset**: Rekapitulasi pendapatan bersih harian/bulanan secara transparan.
* **Dynamic Billing & Console Management**: Bebas menambah, mengubah, atau menghapus unit PS dan tarif billing per jam langsung dari basis data.
* **Walk-In / Cashier POS**: Memungkinkan kasir toko fisik untuk menginput pelanggan yang datang langsung tanpa antre web, mengunci slot jam secara instan.
* **User & Booking Control**: Manajemen akun pengguna (ubah role user/admin, hapus akun) serta edit/geser jadwal booking pelanggan yang fleksibel.
* **Thermal Receipt Printing**: Cetak struk transaksi fisik/digital berstandar kasir siap printer thermal.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, Axios, React Router Dom.
* **Backend**: Node.js, Express.js, RESTful API.
* **Database**: MongoDB & Mongoose ODM.
* **File Upload**: Multer (untuk penyimpanan bukti pembayaran).
* **Authentication**: JSON Web Token (JWT) & bcryptjs.

---

## 📂 Struktur Direktori Proyek

```text
aq-game-reborn/
├── backend/
│   ├── config/          # Konfigurasi koneksi Database MongoDB
│   ├── controllers/     # Logika bisnis (Auth, Console, Booking, User)
│   ├── middleware/      # Middleware Auth JWT & Upload Multer
│   ├── models/          # Skema Database Mongoose (User, PSConsole, Booking)
│   ├── routes/          # Endpoint API Router
│   ├── uploads/         # Direktori penyimpanan bukti transfer
│   └── server.js        # Titik masuk utama server Express
│
└── frontend/
    ├── src/
    │   ├── components/  # Komponen modular (Navbar, dll)
    │   ├── pages/       # Halaman utama (Home, Login, Register, Admin, MyBookings)
    │   ├── services/    # Konfigurasi Axios API interceptor
    │   ├── App.jsx      # Konfigurasi Router Utama
    │   └── main.css     # Styling Tailwind CSS
    └── package.json
