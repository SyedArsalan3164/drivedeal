const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

// We configure dotenv in case it is loaded before server.js initializes it, though typically server.js does it.
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'drivedeal_uploads',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp', 'avif', 'gif'],
  },
});

const upload = multer({ storage: storage });

// Accept up to 10 images sent under the field name 'images'
router.post('/', protect, admin, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: 'No files uploaded.' });
  }

  // With CloudinaryStorage, the public URL is stored in file.path
  const urls = req.files.map((file) => file.path);
  
  res.send({ urls });
});

module.exports = router;
