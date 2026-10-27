const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register user baru
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Cek apakah email sudah terdaftar
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat user baru (jika role tidak diisi, default 'user')
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || 'user',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Data user tidak valid' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email atau password salah' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };