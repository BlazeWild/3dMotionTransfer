require('dotenv').config();
const express = require('express');
const cors = require("cors");
const path = require('path');
const { Server } = require("socket.io");
const { createServer } = require("http");
const { spawn } = require("child_process");
// const logger = require('./utils/logger'); // Optional: Custom logger utility

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server);

// Import route files with error handling
const loadRoute = (path) => {
  try {
    return require(path);
  } catch (error) {
    console.error(`Error loading route: ${path}`, error);
    return null;
  }
};

const keypointsRoute = loadRoute("./routes/keypointsRoute");
const threeDKeypointsRoute = loadRoute("./routes/3dkeypointsRoute");
const extractRoute = loadRoute("./routes/extractRoute");
const extract3DRoute = loadRoute("./routes/3dextractRoute");
const videoUploadRoute = loadRoute("./routes/upload");
const save3DSkeletonRoute = loadRoute('./routes/save3DSkeleton');

// Serve a basic route
app.get("/", (req, res) => {
  res.send("Pose Detection Backend");
});

// Increase the payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS for all routes
app.use(cors());

// Middleware to serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use route files
if (keypointsRoute) app.use("/api/keypoints", keypointsRoute);
if (threeDKeypointsRoute) app.use("/api/3dkeypoints", threeDKeypointsRoute);
if (extractRoute) app.use("/api/extract", extractRoute);
if (videoUploadRoute) app.use("/api/upload", videoUploadRoute);
if (save3DSkeletonRoute) app.use('/api/fbxdata', save3DSkeletonRoute);
if (extract3DRoute) app.use("/api/3dextract", extract3DRoute);

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("Client connected");

  const pythonScriptPath = process.env.PYTHON_SCRIPT_PATH || "path/to/3dextract.py";

  // Spawn the Python script
  const pythonProcess = spawn("python3", [pythonScriptPath]);

  pythonProcess.stdout.on("data", (data) => {
    try {
      const frame = data.toString().trim();
      socket.emit("frame", { image: frame });
    } catch (err) {
      console.error("Error processing Python data:", err);
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python process closed with code ${code}`);
    // Optionally restart the Python process here
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    pythonProcess.kill();
  });

  socket.on("error", (err) => {
    console.error("Socket.IO error:", err);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
