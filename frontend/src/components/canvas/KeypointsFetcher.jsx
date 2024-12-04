// src/utils/KeyPointsFetcher.js
import axios from 'axios';

const KeyPointsFetcher = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/keypoints');
    return response.data; // Assuming the response is an array of keypoints with name and coordinates
  } catch (error) {
    console.error("Error fetching keypoints:", error);
    return [];
  }
};

export default KeyPointsFetcher;