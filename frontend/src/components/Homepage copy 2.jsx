import React, { useState } from 'react';
import { CanvasComponent } from './canvas';

const Homepage = () => {
  const [videoSrc, setVideoSrc] = useState(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoSrc(videoURL);
    }
  };

  return (
    <section
      className="relative w-full h-screen bg-primary bg-contain bg-cover bg-no-repeat bg-center flex items-center justify-center"
    >
      {/* Parent Div - Full Width */}
      <div
        className="w-full bg-primary flex flex-col md:flex-row gap-5 shadow-lg rounded-lg"
        style={{
          margin: '0.5rem', // Minimal top and bottom space
          padding: '1rem',
          height: '100vh', // Covers most of the height, leaving minimal top and bottom margins
        }}
      >
        {/* Left Column - Upload and Video */}
        <div
          className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-10 rounded-md"
          style={{
            height: '100%', // Matches parent height
            backgroundColor: "#3C3C3C"
          }}
        >
          {videoSrc ? (
            <video
              controls
              src={videoSrc}
              className="w-full h-full rounded-md"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="flex flex-col items-center">
              <label
                htmlFor="video-upload"
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              >
                Upload Video
              </label>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Right Column - Canvas */}
        <div
          className="flex justify-center items-center w-full md:w-1/2 bg-white rounded-md"
          style={{
            height: '100%', // Matches parent height
          }}
        >
          <CanvasComponent />
        </div>
      </div>
    </section>
  );
};

export default Homepage;
