const express = require("express");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const router = express.Router();

router.post("/", async (req, res) => {
  const { videoSrc } = req.body;

  if (!videoSrc) {
    return res.status(400).json({ error: "No video source provided." });
  }

  const videoName = path.basename(videoSrc);
  const videoPath = path.join(__dirname, "../uploads", videoName);
  const outputDir = path.join(__dirname, "../outputs");
  const outputPath = path.join(outputDir, `${path.parse(videoName).name}_keypoints.json`);

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  try {
    const pythonProcess = spawn("python3", ["3dextract.py", videoPath, outputPath]);

    pythonProcess.stdout.on("data", (data) => {
      console.log(`Python Output: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        return res.json({ message: "3D Keypoints extracted", keypointsPath: `/outputs/${path.basename(outputPath)}` });
      } else {
        return res.status(500).json({ error: "Failed to extract 3D keypoints." });
      }
    });
  } catch (error) {
    console.error("Error running Python script:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
