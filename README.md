<div align="center">

# 🎮 AQ Game Reborn

### *Sistem Rental PlayStation Modern Berbasis Web*

[![MERN Stack](https://img.shields.io/badge/Stack-MERN%20(MongoDB%2C%20Express%2C%20React%2C%20Node.js)-0f172a?style=for-the-badge&logo=react&logoColor=61DAFB)](https://mern.io/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-22c55e?style=for-the-badge)](#)

`	ext
> console.log("Play. Rent. Game On.");
`

</div>

## 📌 Tentang Project

**AQ Game Reborn** adalah aplikasi web full-stack berbasis MERN (MongoDB, Express.js, React.js, Node.js) yang dirancang khusus untuk mengotomatisasi operasional bisnis rental PlayStation. Aplikasi ini menggantikan sistem pencatatan manual dengan platform booking online, manajemen billing real-time, verifikasi pembayaran QRIS, serta Point of Sale (POS) untuk transaksi walk-in langsung di kasir.

Dirancang dengan tampilan modern dan alur kerja yang efisien, AQ Game Reborn mempermudah pelanggan untuk melakukan booking unit PS secara mandiri, sekaligus membantu admin & kasir dalam mengelola slot, harga, pengguna, dan laporan keuangan.

## ✨ Fitur Unggulan

### 🧑‍💻 Untuk Pelanggan (User)
- **Visualisasi Slot Real-Time** – Melihat ketersediaan unit PS secara langsung (hijau = tersedia, merah = terbooking)
- **Booking Online** – Pemesanan unit PS5/PS4/PS3 berdasarkan tanggal & jam dengan perhitungan durasi otomatis
- **Pembayaran QRIS** – Unggah bukti pembayaran untuk verifikasi oleh admin/kasir
- **Riwayat Booking** – Pantau status pesanan (PENDING, PAID, CONFIRMED, CANCELLED, REJECTED)
- **E-Receipt** – Cetak struk digital/thermal untuk transaksi yang telah dikonfirmasi
- **Integrasi WhatsApp** – Akses cepat ke admin via WhatsApp untuk konfirmasi booking

### 🛡️ Untuk Admin & Kasir
- **Dashboard Analitik** – Monitoring pendapatan, jumlah booking, dan ringkasan transaksi secara real-time
- **Manajemen Unit PS** – Tambah, edit, hapus unit beserta tipe (PS3/PS4/PS5) dan harga per jam
- **Walk-in POS (Kasir)** – Input transaksi langsung untuk pelanggan offline tanpa perlu proses booking online
- **Manajemen Booking** – Ubah status, edit jadwal, verifikasi pembayaran, atau batalkan booking
- **Manajemen Pengguna** – Kelola role pengguna (user / dmin) dan hak akses
- **Cetak Struk Thermal** – Generate invoice siap cetak untuk printer thermal

## 🛠️ Tech Stack

| Layer | Teknologi | Kegunaan |
| --- | --- | --- |
| **Frontend** | [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [React Router DOM v7](https://reactrouter.com/) | UI, routing, dan build tool yang cepat |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) | Styling modern & icon set |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/) | REST API server |
| **Database** | [MongoDB](https://www.mongodb.com/), [Mongoose ODM](https://mongoosejs.com/) | Penyimpanan data & schema modeling |
| **Auth & Security** | [JSON Web Token (JWT)](https://jwt.io/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Autentikasi & enkripsi password |
| **File Handling** | [Multer](https://github.com/expressjs/multer) | Upload bukti pembayaran |
| **HTTP Client** | [Axios](https://axios-http.com/) | Komunikasi frontend-backend |

## 📸 Dokumentasi Tampilan Aplikasi

Berikut beberapa screenshot antarmuka dari aplikasi AQ Game Reborn yang tersimpan di folder [photo/](./photo).

### 🏠 Halaman Utama
![Dashboard Depan](./photo/dashboard%20depan.png)

*Tampilan beranda untuk pelanggan menampilkan daftar unit PS beserta ketersediaan slot real-time.*

### 👨‍💼 Dashboard Admin
![Dashboard Admin](./photo/dashboard%20Admin.png)

*Panel kontrol admin menampilkan statistik pendapatan, booking aktif, dan ringkasan operasional.*

### 🧮 Halaman Kasir (POS Walk-In)
![Halaman Kasir](./photo/halaman%20kasir.png)

*Mode kasir untuk transaksi walk-in langsung, pemilihan unit, durasi sewa, dan pencetakan struk.*

### 🕹️ Kelola Unit Admin
![Halaman Kelola Unit Admin](./photo/halaman%20kelola%20unit%20admin.png)

*Manajemen unit PlayStation (tambah/edit/hapus), tipe konsol, dan penentuan harga per jam.*

### 📜 Riwayat Booking
![Riwayat Booking](./photo/riwayat%20booking.png)

*Daftar seluruh booking pelanggan beserta status pembayaran, verifikasi, dan aksi admin/kasir.*

### 🧾 Bukti Struk
![Bukti Struk](./photo/bukti%20struk.png)

*Contoh hasil cetakan struk thermal untuk transaksi yang telah dikonfirmasi.*

## 📂 Struktur Direktori

`	ext
rental-ps-aq-game-reborn/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── vercel.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
└── photo/
`

## 🚀 Instalasi & Menjalankan Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (lokal atau Atlas)
- [Git](https://git-scm.com/)

### 1. Clone Repository

`ash
git clone https://github.com/USERNAME_KAMU/rental-ps-aq-game-reborn.git
cd rental-ps-aq-game-reborn
`

### 2. Setup Backend

`ash
cd backend
npm install
`

Buat file .env di folder ackend/:

`env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/aq_game_reborn
JWT_SECRET=aqgamereborn_super_secret_key_2026
`

Jalankan backend:

`ash
npm run dev  # development
npm start    # production
`

Backend berjalan di http://localhost:5000

### 3. Setup Frontend

`ash
cd frontend
npm install
npm run dev
`

Frontend berjalan di http://localhost:5173

## 🌐 Deployment

- **Backend**: Dapat dideploy ke [Vercel](https://vercel.com/) dengan konfigurasi ackend/vercel.json
- **Frontend**: Dapat dideploy ke Vercel/Netlify. Sesuaikan URL API di rontend/src/services/api.js

## 👨‍💻 Author

**Rudi Asman Salim** – *Full-Stack Developer*

## 📄 Lisensi

Project ini dilisensikan dibawah [MIT License](LICENSE).
