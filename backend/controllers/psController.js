const PSConsole = require('../models/PSConsole');

// @desc    Get semua unit PS
// @route   GET /api/consoles
// @access  Public
const getConsoles = async (req, res) => {
  try {
    const consoles = await PSConsole.find({});
    res.json(consoles);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Tambah unit PS baru (Billing & Tarif diatur disini)
// @route   POST /api/consoles
// @access  Private/Admin
const createConsole = async (req, res) => {
  try {
    const { name, type, pricePerHour, description } = req.body;

    if (!name || !type || !pricePerHour) {
      return res.status(400).json({ message: 'Nama, tipe, dan tarif per jam wajib diisi' });
    }

    const newConsole = await PSConsole.create({
      name,
      type,
      pricePerHour,
      description,
    });

    res.status(201).json(newConsole);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Update unit PS atau billing tarif
// @route   PUT /api/consoles/:id
// @access  Private/Admin
const updateConsole = async (req, res) => {
  try {
    const { name, type, pricePerHour, isAvailable, description } = req.body;

    const psConsole = await PSConsole.findById(req.params.id);

    if (!psConsole) {
      return res.status(404).json({ message: 'Unit PS tidak ditemukan' });
    }

    psConsole.name = name || psConsole.name;
    psConsole.type = type || psConsole.type;
    psConsole.pricePerHour = pricePerHour !== undefined ? pricePerHour : psConsole.pricePerHour;
    psConsole.isAvailable = isAvailable !== undefined ? isAvailable : psConsole.isAvailable;
    psConsole.description = description !== undefined ? description : psConsole.description;

    const updatedConsole = await psConsole.save();
    res.json(updatedConsole);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Hapus unit PS
// @route   DELETE /api/consoles/:id
// @access  Private/Admin
const deleteConsole = async (req, res) => {
  try {
    const psConsole = await PSConsole.findById(req.params.id);

    if (!psConsole) {
      return res.status(404).json({ message: 'Unit PS tidak ditemukan' });
    }

    await psConsole.deleteOne();
    res.json({ message: 'Unit PS berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

module.exports = {
  getConsoles,
  createConsole,
  updateConsole,
  deleteConsole,
};