const Booking = require('../models/Booking');
const PSConsole = require('../models/PSConsole');

// Fungsi helper untuk menghitung jam selesai (endTime)
const calculateEndTime = (startTime, durationHours) => {
  const [hour, minute] = startTime.split(':').map(Number);
  const totalMinutes = hour * 60 + minute + durationHours * 60;
  const endHour = Math.floor(totalMinutes / 60) % 24;
  const endMinute = totalMinutes % 60;
  return `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
};

// @desc    Cek slot jam yang kosong/berisi untuk unit PS pada tanggal tertentu
// @route   GET /api/bookings/slots?psId=xxx&date=YYYY-MM-DD
// @access  Public
const getAvailableSlots = async (req, res) => {
  try {
    const { psId, date } = req.query;

    if (!psId || !date) {
      return res.status(400).json({ message: 'Parameter psId dan date wajib diisi' });
    }

    // Ambil semua booking yang aktif/confirmed/paid pada tanggal tersebut untuk unit PS terkait
    const bookings = await Booking.find({
      psConsole: psId,
      bookingDate: date,
      status: { $in: ['PAID', 'CONFIRMED', 'PENDING'] },
    });

    // Contoh jam operasional rental: 10:00 sampai 23:00
    const operationalHours = [
      '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
      '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
    ];

    // Tandai jam mana saja yang sudah dibooking
    const bookedHoursSet = new Set();
    bookings.forEach((b) => {
      let [sH] = b.startTime.split(':').map(Number);
      for (let i = 0; i < b.durationHours; i++) {
        let hourStr = `${String(sH + i).padStart(2, '0')}:00`;
        bookedHoursSet.add(hourStr);
      }
    });

    const slots = operationalHours.map((time) => ({
      time,
      isBooked: bookedHoursSet.has(time),
    }));

    res.json({ date, psId, slots });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Buat booking baru & kalkulasi total harga billing
// @route   POST /api/bookings
// @access  Private (User)
const createBooking = async (req, res) => {
  try {
    const { psConsoleId, bookingDate, startTime, durationHours } = req.body;

    if (!psConsoleId || !bookingDate || !startTime || !durationHours) {
      return res.status(400).json({ message: 'Semua field booking wajib diisi' });
    }

    // Cari unit PS untuk mengambil harga billing per jam
    const ps = await PSConsole.findById(psConsoleId);
    if (!ps) {
      return res.status(404).json({ message: 'Unit PS tidak ditemukan' });
    }

    const endTime = calculateEndTime(startTime, Number(durationHours));
    const totalPrice = ps.pricePerHour * Number(durationHours);

    const booking = await Booking.create({
      user: req.user._id,
      psConsole: psConsoleId,
      bookingDate,
      startTime,
      durationHours: Number(durationHours),
      endTime,
      totalPrice,
      status: 'PENDING',
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Upload bukti pembayaran (barkod/transfer) untuk booking tertentu
// @route   PUT /api/bookings/:id/pay
// @access  Private (User)
const uploadPaymentProof = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Data booking tidak ditemukan' });
    }

    // Pastikan yang upload adalah pemilik booking
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Tidak diizinkan mengakses booking ini' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Silakan upload file bukti pembayaran' });
    }

    booking.paymentProof = `/uploads/${req.file.filename}`;
    booking.status = 'PAID'; // Status berubah jadi PAID, menunggu konfirmasi admin

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Admin konfirmasi status booking (CONFIRMED / REJECTED)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // CONFIRMED, REJECTED, CANCELLED
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking tidak ditemukan' });
    }

    booking.status = status || booking.status;
    const updated = await booking.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get semua booking (Admin lihat semua, User lihat miliknya sendiri)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      bookings = await Booking.find({})
        .populate('user', 'name email phone')
        .populate('psConsole', 'name type pricePerHour');
    } else {
      bookings = await Booking.find({ user: req.user._id })
        .populate('psConsole', 'name type pricePerHour');
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Admin edit data booking (geser jam, tanggal, atau status)
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBookingAdmin = async (req, res) => {
  try {
    const { bookingDate, startTime, durationHours, status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking tidak ditemukan' });
    }

    if (bookingDate) booking.bookingDate = bookingDate;
    if (startTime) {
      booking.startTime = startTime;
      // Hitung ulang jam selesai (endTime)
      const [hour, minute] = startTime.split(':').map(Number);
      const dur = durationHours || booking.durationHours;
      const totalMinutes = hour * 60 + minute + dur * 60;
      const endHour = Math.floor(totalMinutes / 60) % 24;
      const endMinute = totalMinutes % 60;
      booking.endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
    }
    if (durationHours) {
      booking.durationHours = Number(durationHours);
      // Recalculate totalPrice if psConsole exists or duration changes
      const ps = await PSConsole.findById(booking.psConsole);
      if (ps) {
        booking.totalPrice = ps.pricePerHour * Number(durationHours);
      }
    }
    if (status) booking.status = status;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Admin hapus booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBookingAdmin = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking tidak ditemukan' });
    }
    await booking.deleteOne();
    res.json({ message: 'Booking berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};


const quickBookingAdmin = async (req, res) => {
  try {
    const { customerName, customerPhone, psConsoleId, bookingDate, startTime, durationHours } = req.body;

    if (!customerName || !psConsoleId || !bookingDate || !startTime || !durationHours) {
      return res.status(400).json({ message: 'Nama pelanggan dan detail booking wajib diisi' });
    }

    // Cari unit PS
    const ps = await PSConsole.findById(psConsoleId);
    if (!ps) {
      return res.status(404).json({ message: 'Unit PS tidak ditemukan' });
    }

    const endTime = calculateEndTime(startTime, Number(durationHours));
    const totalPrice = ps.pricePerHour * Number(durationHours);

    // Buat atau cari user temporer khusus walk-in (atau simpan langsung dengan mencatat nama pelanggan)
    const booking = await Booking.create({
      user: req.user._id, // dicatat atas nama admin/kasir yang melayani
      psConsole: psConsoleId,
      bookingDate,
      startTime,
      durationHours: Number(durationHours),
      endTime,
      totalPrice,
      status: 'CONFIRMED', // Langsung confirmed karena bayar tunai di tempat
      paymentProof: '/uploads/walk-in-cash.png' // Keterangan bayar tunai
    });

    res.status(201).json({
      message: 'Quick booking walk-in berhasil dibuat!',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};



module.exports = {
  getAvailableSlots,
  createBooking,
  uploadPaymentProof,
  updateBookingStatus,
  getBookings,
  updateBookingAdmin,
  deleteBookingAdmin,
  quickBookingAdmin
};