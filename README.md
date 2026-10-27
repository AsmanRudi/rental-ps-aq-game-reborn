Markdown
<div align="center">

# 🎮 AQ GAME REBORN 🎮
### *The Ultimate Modern PlayStation Rental & Gaming Lounge Platform*

<img src="https://img.shields.io/badge/Stack-MERN%20(MongoDB%2C%20Express%2C%20React%2C%20Node)-indigo?style=for-the-badge&logo=react" alt="MERN Stack" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
<img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge" alt="Status" />

</div>

<br>

**AQ Game Reborn** is a modern full-stack MERN web application designed to revolutionize PlayStation rental business operations. It replaces traditional manual logbooks with a seamless real-time booking platform, dynamic billing management, QRIS payment verification, and an offline walk-in POS cashier dashboard.

---

## ✨ Core Features

### 👤 1. Public & User Dashboard
* **Live Slot Visualizer**: Check console availability in real-time (Green = Available, Red = Booked).
* **Dynamic Console Selection**: Filter gaming units by type (`PS5`, `PS4`, `PS3`) with hourly rate transparency.
* **Instant Booking & QRIS Payment**: Self-service reservation system with QRIS barcode payment simulation and receipt upload.
* **WhatsApp Auto-Chat**: Direct integration for quick admin confirmation via WhatsApp.
* **Booking History & E-Receipts**: Track order statuses (Pending, Paid, Confirmed, Cancelled) and print professional thermal receipts.

### 🛡️ 2. Administrator & Cashier Dashboard
* **Financial Analytics & Revenue**: Real-time net revenue tracking and earnings summary.
* **Dynamic Billing & Console Control**: Seamlessly add, update, or remove PS units and hourly pricing rates directly from the database.
* **Walk-In POS (Cashier Mode)**: Instantly log physical walk-in customers on the spot, locking time slots in real-time without scheduling conflicts.
* **User & Booking Management**: Complete user privilege control (promote/demote roles, delete accounts) and flexible booking schedule editing.
* **Thermal Receipt Printing**: Instant thermal printer-ready invoice generation for physical or digital distribution.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, Axios, React Router DOM.
* **Backend**: Node.js, Express.js, RESTful API architecture.
* **Database**: MongoDB & Mongoose ODM.
* **File Upload**: Multer (secure payment proof management).
* **Authentication**: JSON Web Token (JWT) & bcryptjs.

---

## 📂 Project Directory Structure

```text
aq-game-reborn/
├── backend/
│   ├── config/          # Database connection configuration
│   ├── controllers/     # Business logic (Auth, Console, Booking, User)
│   ├── middleware/      # JWT authentication & Multer upload middleware
│   ├── models/          # Mongoose database schemas (User, PSConsole, Booking)
│   ├── routes/          # API endpoint routers
│   ├── uploads/         # Storage directory for payment transfer proofs
│   └── server.js        # Express application entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components (Navbar, etc.)
    │   ├── pages/       # Core views (Home, Login, Register, Admin, MyBookings)
    │   ├── services/    # Axios API service configurations
    │   ├── App.jsx      # Main application routing
    │   └── main.css     # Tailwind CSS styling setup
    └── package.json
🚀 Installation & Local Setup
Ensure you have Node.js and MongoDB installed on your machine.

1. Clone the Repository & Navigate
Bash
git clone [https://github.com/USERNAME_KAMU/aq-game-reborn.git](https://github.com/USERNAME_KAMU/aq-game-reborn.git)
cd aq-game-reborn
2. Run the Backend Server
Bash
cd backend
npm install
Create a .env file inside the backend folder:

Cuplikan kode
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/aq_game_reborn
JWT_SECRET=aqgamereborn_super_secret_key_2026
Start the backend development server:

Bash
npm run dev
3. Run the Frontend Client
Open a new terminal window and navigate to the frontend folder:

Bash
cd frontend
npm install
npm run dev
Access the application in your browser at http://localhost:5173.

👥 Author & Creator
Rudi Asman Salim - Full-Stack Developer
