const express = require('express');
const cors = require("cors");

// Import route files
const keypointsRoute = require("./routes/keypointsRoute");
const threeDKeypointsRoute = require("./routes/3dkeypointsRoute");
const extractRoute = require("./routes/extractRoute");
const videoUploadRoute = require("./routes/videoUploadRoute");
const save3DSkeletonRoute = require('./routes/save3DSkeleton');

const app = express();
const port = 5000;

// Increase the payload size limit
app.use(express.json({ limit: '50mb' })); // Adjust the size as per your needs
app.use(express.urlencoded({ limit: '50mb', extended: true })); // For URL-encoded data

// Enable CORS for all routes
app.use(cors());

// Middleware to handle JSON responses
app.use(express.json());

// Use route files
app.use("/api/keypoints", keypointsRoute);
app.use("/api/3dkeypoints", threeDKeypointsRoute);
app.use("/api/extract", extractRoute);
app.use("/api/upload", videoUploadRoute);
app.use('/api/fbxdata', save3DSkeletonRoute);


// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
