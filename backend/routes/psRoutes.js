const express = require('express');
const router = express.Router();
const {
  getConsoles,
  createConsole,
  updateConsole,
  deleteConsole,
} = require('../controllers/psController');
const { protect, admin } = require('../middleware/authMiddleware');

// GET /api/consoles dapat diakses publik (tanpa protect)
// POST /api/consoles hanya untuk Admin
router.route('/')
  .get(getConsoles) 
  .post(protect, admin, createConsole);

router.route('/:id')
  .delete(protect, admin, deleteConsole);

module.exports = router;