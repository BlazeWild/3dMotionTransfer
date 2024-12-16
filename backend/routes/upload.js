const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Validate file type
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// POST route to upload video
router.post('/', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
  }

  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ message: 'File uploaded successfully.', videoUrl: fileUrl });
});

// DELETE route to delete video
router.delete('/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadPath, filename);
  
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(404).json({ error: 'File not found.' });
        }
        return res.status(500).json({ error: 'Failed to delete the file.' });
      }
      res.json({ message: 'File deleted successfully.' });
    });
  });  

// Error handling middleware for Multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(500).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

module.exports = router;
