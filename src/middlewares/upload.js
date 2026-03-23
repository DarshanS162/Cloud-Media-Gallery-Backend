const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/s3');

// Allowed file types
const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'video/mp4',
  'video/quicktime'
];

// File filter
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'), false);
  }
};

// Multer S3 storage config
const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,

  key: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);

    const folder = file.mimetype.startsWith('video')
      ? 'videos'
      : 'images';

    const fileName = `${timestamp}-${random}-${file.originalname}`;

    cb(null, `uploads/${folder}/${fileName}`);
  }
});

// Multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,

  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
    files: 10 // max 10 files per request
  }
});

module.exports = upload;