const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const psRoutes = require('./routes/psRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');

// Load env variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve folder uploads sebagai static folder untuk akses gambar bukti pembayaran
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/consoles', psRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Test Route Root
app.get('/', (req, res) => {
  res.send('API Rental PS AQ Game Reborn Berjalan...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});