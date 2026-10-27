const express = require('express');
const router = express.Router();
const { getUsers, updateUserAdmin, deleteUserAdmin } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getUsers);
router.route('/:id').put(protect, admin, updateUserAdmin).delete(protect, admin, deleteUserAdmin);

module.exports = router;