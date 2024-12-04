const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Route to retrieve keypoints from keypoints.json
router.get("/", (req, res) => {
  const keypointsPath = path.join(__dirname, "..", "output", "keypoints.json");

  // Try to read the keypoints.json file
  fs.readFile(keypointsPath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Handle file not found error
        return res.status(404).json({ status: "error", message: "Keypoints not found" });
      } else {
        // Handle other errors
        return res.status(500).json({ status: "error", message: "Error reading keypoints file" });
      }
    }

    try {
      const keypoints = JSON.parse(data);
      return res.json({ status: "success", keypoints });
    } catch (jsonError) {
      // Handle JSON parsing errors
      return res.status(500).json({ status: "error", message: "Error decoding JSON" });
    }
  });
});

module.exports = router;
