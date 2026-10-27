const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PSConsole = require('./models/PSConsole');

dotenv.config();

const sampleConsoles = [
  {
    name: "PS4 - Reg 01",
    type: "PS4",
    pricePerHour: 8000,
    isAvailable: true,
    description: "DualShock 4 x2, TV LED 40 Inch"
  },
  {
    name: "PS4 - Reg 02",
    type: "PS4",
    pricePerHour: 8000,
    isAvailable: true,
    description: "DualShock 4 x2, TV LED 40 Inch"
  },
  {
    name: "PS3 - Reg 01",
    type: "PS3",
    pricePerHour: 6000,
    isAvailable: true,
    description: "Rental Hemat, Cocok untuk Mabar"
  },
  {
    name: "PS3 - Reg 02",
    type: "PS3",
    pricePerHour: 6000,
    isAvailable: true,
    description: "Rental Hemat, Cocok untuk Mabar"
  },
  {
    name: "PS3 - Reg 03",
    type: "PS3",
    pricePerHour: 6000,
    isAvailable: true,
    description: "Rental Hemat, Cocok untuk Mabar"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected untuk Seeding...');

    // Hapus data lama (opsional) atau langsung masukkan
    await PSConsole.deleteMany({});
    await PSConsole.insertMany(sampleConsoles);

    console.log('DATA UNIT PS BERHASIL DITAMBAHKAN KE DATABASE!');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedDB();