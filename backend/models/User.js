const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama harus diisi'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email harus diisi'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password harus diisi'],
      minlength: 6,
    },
    phone: {
      type: String,
      required: [true, 'Nomor HP/WhatsApp harus diisi'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);