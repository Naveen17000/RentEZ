const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/products';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    // Check for valid image types
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed!'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files total
  }
}).fields([
  { name: 'image', maxCount: 5 }
]);

// Wrapper middleware with error handling
const uploadMiddleware = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Handle Multer errors
      switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          return res.status(400).json({
            success: false,
            message: 'File is too large. Maximum size is 5MB.'
          });
        case 'LIMIT_FILE_COUNT':
          return res.status(400).json({
            success: false,
            message: 'Too many files. Maximum is 5 images.'
          });
        case 'LIMIT_UNEXPECTED_FILE':
          return res.status(400).json({
            success: false,
            message: 'Unexpected field in upload.'
          });
        default:
          return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
          });
      }
    } else if (err) {
      // Handle other errors
      return res.status(400).json({
        success: false,
        message: err.message || 'Upload failed'
      });
    }

    // Validate that files were actually uploaded when required
    if (req.method === 'POST' && (!req.files || !req.files['image'])) {
      return res.status(400).json({
        success: false,
        message: 'At least one product image is required.'
      });
    }

    next();
  });
};

module.exports = uploadMiddleware;