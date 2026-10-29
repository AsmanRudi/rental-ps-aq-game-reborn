
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PSConsole = require('./models/PSConsole');

dotenv.config();

const sampleConsoles = [
  {
    name: 'PS4 - Reg 01',
    type: 'PS4',
    pricePerHour: 8000,
    isAvailable: true,
    description: 'DualShock 4 x2, TV LED 40 Inch',
  },
  {
    name: 'PS4 - Reg 02',
    type: 'PS4',
    pricePerHour: 8000,
    isAvailable: true,
    description: 'DualShock 4 x2, TV LED 40 Inch',
  },
  {
    name: 'PS3 - Reg 01',
    type: 'PS3',
    pricePerHour: 6000,
    isAvailable: true,
    description: 'Rental Hemat, Cocok untuk Mabar',
  },
  {
    name: 'PS3 - Reg 02',
    type: 'PS3',
    pricePerHour: 6000,
    isAvailable: true,
    description: 'Rental Hemat, Cocok untuk Mabar',
  },
  {
    name: 'PS3 - Reg 03',
    type: 'PS3',
    pricePerHour: 6000,
    isAvailable: true,
    description: 'Rental Hemat, Cocok untuk Mabar',
  },
];

async function seedDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI belum diatur di backend/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB berhasil terhubung.');

    for (const consoleData of sampleConsoles) {
      await PSConsole.updateOne(
        { name: consoleData.name },
        { $set: consoleData },
        { upsert: true, runValidators: true }
      );
    }

    const total = await PSConsole.countDocuments();

    console.log('Seeding selesai.');
    console.log(`Total unit konsol dalam database: ${total}`);
    console.log('Lima unit contoh berhasil diperbarui atau ditambahkan.');
  } catch (error) {
    console.error('Seeding gagal:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDB();
