const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  createBooking,
  uploadPaymentProof,
  updateBookingStatus,
  getBookings,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


const { updateBookingAdmin, deleteBookingAdmin, quickBookingAdmin } = require('../controllers/bookingController');
router.post('/quick', protect, admin, quickBookingAdmin);
router.route('/:id').put(protect, admin, updateBookingAdmin).delete(protect, admin, deleteBookingAdmin);

router.route('/').get(protect, getBookings).post(protect, createBooking);
router.get('/slots', getAvailableSlots);
router.put('/:id/pay', protect, upload.single('image'), uploadPaymentProof);
router.put('/:id/status', protect, admin, updateBookingStatus);

module.exports = router;