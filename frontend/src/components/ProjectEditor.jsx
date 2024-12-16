import React, { useState, useEffect } from "react";
import { CanvasComponent } from "./canvas";
import Draggable from "react-draggable";

const ProjectEditor = () => {
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [canvasSize, setCanvasSize] = useState({ width: 1280, height: 720 });
  const [videoSize, setVideoSize] = useState({ width: 320, height: 180 });

  // Update canvas size based on aspect ratio, keeping height constant
  useEffect(() => {
    const [widthRatio, heightRatio] = aspectRatio.split(":").map(Number);
    const height = 720; // Constant height
    const width = (height * widthRatio) / heightRatio; // Adjust width
    setCanvasSize({ width, height });
  }, [aspectRatio]);

  // Resize video viewer
  const resizeVideo = (newWidth) => {
    const aspectRatio = 16 / 9; // Assuming video is 16:9
    const newHeight = newWidth / aspectRatio;
    setVideoSize({ width: newWidth, height: newHeight });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-white">
      {/* Top Bar */}
      <header className="w-full px-4 py-2 bg-gray-800 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Project Editor</h1>
        <button
          className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => alert("Project Saved!")}
        >
          Save Project
        </button>
      </header>

      {/* Main Editor UI */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-1/6 bg-gray-700 p-4 flex-shrink-0 overflow-y-auto">
          <h2 className="font-bold text-lg mb-2">Models</h2>
          <ul className="space-y-2 mt-2">
            {["Default", "Humanoid", "Robot", "Environment"].map((model) => (
              <li
                key={model}
                className="cursor-pointer p-2 rounded-lg hover:bg-gray-600"
              >
                {model}
              </li>
            ))}
          </ul>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 flex flex-col bg-gray-800 relative">
          <div
            className="flex-grow relative bg-gray-700 mx-auto"
            style={{
              width: `${canvasSize.width}px`,
              height: `${canvasSize.height}px`,
            }}
          >
            <CanvasComponent />
          </div>

          {/* Video Viewer (Overlay) */}
          <Draggable>
            <div
              className="absolute bg-black border border-gray-500 rounded-lg shadow-lg cursor-move"
              style={{
                width: `${videoSize.width}px`,
                height: `${videoSize.height}px`,
              }}
            >
              {/* Display the processed video */}
              <video
                src="http://localhost:5000/processed-video.mp4" // Replace with the actual URL
                className="w-full h-full rounded-lg"
                controls
              />
              <div className="absolute bottom-2 right-2">
                <button
                  className="bg-blue-500 px-2 py-1 text-sm rounded hover:bg-blue-600"
                  onClick={() => resizeVideo(videoSize.width + 20)}
                >
                  +
                </button>
                <button
                  className="bg-red-500 px-2 py-1 text-sm rounded hover:bg-red-600 ml-2"
                  onClick={() => resizeVideo(Math.max(videoSize.width - 20, 100))}
                >
                  -
                </button>
              </div>
            </div>
          </Draggable>


          {/* Playback Controls */}
          <div className="w-full bg-gray-800 flex items-center justify-between p-4 border-t border-gray-700">
            <div className="flex items-center space-x-4">
              <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
                Play
              </button>
              <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
                Pause
              </button>
              <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
                Frame
              </button>
            </div>
            <button className="bg-green-500 px-6 py-2 rounded-lg hover:bg-green-600">
              Export
            </button>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-1/6 bg-gray-700 p-4 flex-shrink-0 overflow-y-auto">
          <h2 className="font-bold text-lg mb-4">Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Aspect Ratio</label>
              <select
                className="w-full p-2 bg-gray-800 rounded-lg"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
              >
                <option value="16:9">16:9</option>
                <option value="4:3">4:3</option>
                <option value="1:1">1:1</option>
                <option value="9:16">9:16</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Resolution</label>
              <select className="w-full p-2 bg-gray-800 rounded-lg">
                <option>1080p</option>
                <option>720p</option>
                <option>480p</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Frame Rate</label>
              <select className="w-full p-2 bg-gray-800 rounded-lg">
                <option>60 FPS</option>
                <option>30 FPS</option>
                <option>24 FPS</option>
              </select>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProjectEditor;
