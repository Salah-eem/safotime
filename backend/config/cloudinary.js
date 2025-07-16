const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage configuration pour multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'safotime-products', // Dossier dans Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' }, // Optimisation automatique
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  }
});

module.exports = {
  cloudinary,
  storage
};
