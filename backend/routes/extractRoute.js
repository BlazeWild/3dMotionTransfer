// backend/routes/modelDataExtract.js
const express = require('express');
const path = require("path");
const fs = require('fs');
const router = express.Router();

// Ensure output/modeldata directory exists
const outputDir = path.join(__dirname, '../output', 'modeldata');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// POST route to save skeleton data from frontend
router.post('/saveSkeletonData', (req, res) => {
  const skeletonData = req.body; // Get the skeleton data sent from the frontend

  // Define the file path where we want to save the data
  const filePath = path.join(outputDir, 'modeloutput.json');

  // Write the skeleton data to a JSON file
  fs.writeFile(filePath, JSON.stringify(skeletonData, null, 2), 'utf-8', (err) => {
    if (err) {
      console.error('Error saving skeleton data:', err);
      return res.status(500).json({ message: 'Error saving skeleton data' });
    }
    console.log(`Skeleton data successfully saved to ${filePath}`);
    res.status(200).json({ message: 'Skeleton data saved successfully' });
  });
});

module.exports = router;


