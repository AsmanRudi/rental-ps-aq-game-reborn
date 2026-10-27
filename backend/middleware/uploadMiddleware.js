const multer = require('multer');
const path = require('path');

// Konfigurasi Penyimpanan Disk
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Filter hanya file gambar
const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (jpg, jpeg, png) yang diizinkan!'));
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// PASTIKAN INI ADA DAN MENGEKSPOR INSTANCE UPLOAD
module.exports = upload;