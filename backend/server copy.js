const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 5000;

// Enable CORS for all routes (similar to FastAPI's CORSMiddleware)
app.use(cors());

// Middleware to handle JSON responses
app.use(express.json());

// Route to retrieve keypoints from keypoints.json
app.get("/keypoints", (req, res) => {
  const keypointsPath = path.join(__dirname,"output", "keypoints.json");

  // Debug: Print current working directory and file location
  console.log(`Current working directory: ${process.cwd()}`);
  console.log(`Looking for file at: ${keypointsPath}`);

  // Try to read the keypoints.json file
  fs.readFile(keypointsPath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Handle file not found error
        console.error(`File not found: ${keypointsPath}`);
        return res.status(404).json({ status: "error", message: "Keypoints not found" });
      } else {
        // Handle other errors
        console.error(`Error reading file: ${err.message}`);
        return res.status(500).json({ status: "error", message: "Error reading keypoints file" });
      }
    }

    try {
      const keypoints = JSON.parse(data);
      console.log("Keypoints loaded successfully");

      // Return the keypoints data as a JSON response
      return res.json({ status: "success", keypoints });
    } catch (jsonError) {
      // Handle JSON parsing errors
      console.error(`JSON Decode Error: ${jsonError.message}`);
      return res.status(500).json({ status: "error", message: "Error decoding JSON" });
    }
  });
});

app.get("/3dkeypoints", (req, res) => {
    const keypointsPath = path.join(__dirname, "output", "3dkeypoints.json");
  
    // Debug: Print current working directory and file location
    console.log(`Current working directory: ${process.cwd()}`);
    console.log(`Looking for file at: ${keypointsPath}`);
  
    // Try to read the 3dkeypoints.json file
    fs.readFile(keypointsPath, "utf8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          // Handle file not found error
          console.error(`File not found: ${keypointsPath}`);
          return res.status(404).json({ status: "error", message: "3D Keypoints not found" });
        } else {
          // Handle other errors
          console.error(`Error reading file: ${err.message}`);
          return res.status(500).json({ status: "error", message: "Error reading 3D keypoints file" });
        }
      }
  
      try {
        const keypoints = JSON.parse(data);
        console.log("3D Keypoints loaded successfully");
  
        // Return the 3D keypoints data as a JSON response
        return res.json({ status: "success", keypoints });
      } catch (jsonError) {
        // Handle JSON parsing errors
        console.error(`JSON Decode Error: ${jsonError.message}`);
        return res.status(500).json({ status: "error", message: "Error decoding JSON" });
      }
    });
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
