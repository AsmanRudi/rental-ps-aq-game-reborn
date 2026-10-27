const express = require('express');
const router = express.Router();
const {
  getConsoles,
  createConsole,
  updateConsole,
  deleteConsole,
} = require('../controllers/psController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getConsoles).post(protect, admin, createConsole);
router.route('/:id').put(protect, admin, updateConsole).delete(protect, admin, deleteConsole);

module.exports = router;