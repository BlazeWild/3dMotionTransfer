const express = require('express');
const cors = require("cors");

// Import route files
const keypointsRoute = require("./routes/keypointsRoute");
const threeDKeypointsRoute = require("./routes/3dkeypointsRoute");
const extractRoute = require("./routes/extractRoute");
const videoUploadRoute = require("./routes/videoUploadRoute");

const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware to handle JSON responses
app.use(express.json());

// Use route files
app.use("/api/keypoints", keypointsRoute);
app.use("/api/3dkeypoints", threeDKeypointsRoute);
app.use("/api/extract", extractRoute);
app.use("/api/upload", videoUploadRoute);

// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
