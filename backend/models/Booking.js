
const mongoose = require('mongoose');
const crypto = require('crypto');

const generateBookingCode = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();

  return `AQ-${date}-${random}`;
};

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      unique: true,
      default: generateBookingCode,
      immutable: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    psConsole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PSConsole',
      required: true,
    },

    bookingDate: {
      type: String,
      required: [true, 'Tanggal booking harus diisi'],
    },

    startTime: {
      type: String,
      required: [true, 'Jam mulai harus diisi'],
    },

    durationHours: {
      type: Number,
      required: [true, 'Durasi rental (jam) harus diisi'],
      min: 1,
    },

    endTime: {
      type: String,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentProof: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: [
        'PENDING',
        'PAID',
        'CONFIRMED',
        'CANCELLED',
        'REJECTED',
      ],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
