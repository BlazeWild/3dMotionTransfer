const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Correct path to the model_data directory
const modelDataDir = path.join(__dirname, '../output/modeldata');  // Path to the existing model_data directory

// POST route to save skeleton data
router.post('/', (req, res) => {
    const skeletonData = req.body; // Get the data sent from the frontend
  
    console.log('Received skeleton data:', skeletonData); // Log the received data for debugging
  
    // Ensure the model_data directory exists
    if (!fs.existsSync(modelDataDir)) {
      return res.status(400).json({ message: 'The model_data directory does not exist. Please ensure it exists.' });
    }
  
    // Define the correct file path to save the data
    const filePath = path.join(modelDataDir, 'data.json');  // Save to model_data/data.json
  
    // Write the data to the file
    fs.writeFile(filePath, JSON.stringify(skeletonData, null, 2), 'utf-8', (err) => {
      if (err) {
        console.error('Error saving skeleton data:', err);
        return res.status(500).json({ message: 'Error saving skeleton data' });
      }
      console.log(`Skeleton data successfully saved to ${filePath}`);
      res.status(200).json({ message: 'Skeleton data saved successfully' });
    });
});

// GET route to fetch the skeleton data from the file
router.get('/', (req, res) => {
  const filePath = path.join(modelDataDir, 'data.json'); // Path to the saved file
  
  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Data not found. Ensure the file exists.' });
  }
  
  // Read the file and send its contents
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading skeleton data:', err);
      return res.status(500).json({ message: 'Error reading skeleton data' });
    }
    console.log('Skeleton data fetched:', data);
    res.status(200).json(JSON.parse(data)); // Return the parsed JSON data
  });
});

module.exports = router;
