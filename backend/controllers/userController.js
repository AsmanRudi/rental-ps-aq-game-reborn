const User = require('../models/User');

// @desc    Get semua user
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Update role atau data user oleh admin
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Hapus user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    await user.deleteOne();
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = { getUsers, updateUserAdmin, deleteUserAdmin };