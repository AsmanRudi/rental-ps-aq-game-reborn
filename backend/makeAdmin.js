const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load konfigurasi .env
dotenv.config();

const makeAdmin = async () => {
  try {
    // Hubungkan ke database MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Terhubung ke MongoDB...');

    // ⚠️ Ganti email di bawah ini dengan email yang kamu pakai saat Register di website
    const targetEmail = "rudydanjer@gmail.com"; 

    // Cari user berdasarkan email dan update rolenya menjadi 'admin'
    const updatedUser = await User.findOneAndUpdate(
      { email: targetEmail },
      { role: 'admin' },
      { new: true }
    );

    if (updatedUser) {
      console.log(`\n========================================`);
      console.log(` SUKSES! Akun berikut sekarang adalah ADMIN:`);
      console.log(` Nama  : ${updatedUser.name}`);
      console.log(` Email : ${updatedUser.email}`);
      console.log(` Role  : ${updatedUser.role}`);
      console.log(`========================================\n`);
    } else {
      console.log(`\n[GAGAL] User dengan email "${targetEmail}" tidak ditemukan.`);
      console.log(`Pastikan kamu sudah melakukan Register akun tersebut melalui website terlebih dahulu!\n`);
    }

    process.exit();
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    process.exit(1);
  }
};

makeAdmin();