const express = require("express");
const multer = require("multer");

const router = express.Router();

// Set up multer for video uploads
const upload = multer({ dest: "uploads/" });

// Video upload route
router.post("/", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: "error", message: "No file uploaded" });
  }

  // Respond with uploaded file information
  res.json({ status: "success", file: req.file });
});

module.exports = router;
