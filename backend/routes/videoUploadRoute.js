// const express = require('express');
// const multer = require('multer');
// const router = express.Router();

// // Set up multer for in-memory storage (no file saving on disk)
// const storage = multer.memoryStorage();
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
//     fileFilter: (req, file, cb) => {
//         const allowedExtensions = ['.mp4', '.mov', '.avi', '.mkv'];
//         const ext = file.originalname.split('.').pop().toLowerCase();
//         if (allowedExtensions.includes(`.${ext}`)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only video files are allowed.'));
//         }
//     }
// });

// // POST route for video upload
// router.post('/upload', upload.single('video'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ error: 'No file uploaded.' });
//     }

//     const videoBase64 = req.file.buffer.toString('base64');
//     const mimeType = req.file.mimetype;

//     res.json({
//         message: 'File uploaded successfully.',
//         video: `data:${mimeType};base64,${videoBase64}`,
//     });
// });

// module.exports = router;
