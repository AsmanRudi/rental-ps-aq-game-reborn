
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const psRoutes = require('./routes/psRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Izinkan domain production dan preview untuk project frontend ini.
const allowedOrigins = [
  /^https:\/\/rental-ps-aq-game-reborn-[a-z0-9-]+\.vercel\.app$/,
];

const corsOptions = {
  origin(origin, callback) {
    // Request tanpa Origin, misalnya pemeriksaan server-ke-server.
    if (!origin) {
      return callback(null, true);
    }

    const allowed = allowedOrigins.some((pattern) =>
      pattern.test(origin)
    );

    if (allowed) {
      return callback(null, true);
    }

    return callback(new Error(`Origin tidak diizinkan oleh CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// Pastikan database siap sebelum request API diproses.
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);

    res.status(503).json({
      message: 'Database tidak tersedia',
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/consoles', psRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.status(200).send('API Rental PS AQ Game Reborn berjalan.');
});

// Ekspor Express untuk Vercel Serverless Functions.
module.exports = app;

// Jalankan listener hanya saat dijalankan secara lokal.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
}
