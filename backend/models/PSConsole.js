const mongoose = require('mongoose');

const psConsoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama unit PS harus diisi (contoh: PS5 - VIP 01)'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['PS3', 'PS4', 'PS5'],
      required: [true, 'Tipe console harus dipilih'],
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Tarif billing per jam harus diisi'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PSConsole', psConsoleSchema);