import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { videoSrc } = location.state || {};

  const handleBack = async () => {
    if (videoSrc) {
      try {
        const videoName = videoSrc.split('/').pop(); // Extract the video filename from the URL
        await fetch(`http://localhost:5000/api/upload/${videoName}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Error deleting the video:", error);
      }
    }
    navigate("/create");
  };

  const handleAnimate = async () => {
    if (videoSrc) {
      try {
        const response = await fetch("http://localhost:5000/api/3dextract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoSrc }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to extract 3D keypoints.");
        }
  
        const result = await response.json();
        console.log("3D Keypoints saved to:", result.keypointsPath);
        navigate("/editor", { state: { videoSrc, keypointsPath: result.keypointsPath } });
      } catch (error) {
        console.error("Error extracting 3D keypoints:", error);
      }
    }
  };
  

  return (
    <section className="h-screen bg-black text-white flex flex-col items-center justify-between px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-3">Preview Your Video</h1>
        <p className="text-lg text-gray-400">
          Review your uploaded video or return to make adjustments.
        </p>
      </div>

      {/* Video Preview Section */}
      <div className="flex-1 w-full max-w-7xl bg-gray-800 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
        {videoSrc ? (
          <video
            src={videoSrc}
            controls
            autoPlay
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <p className="text-lg text-gray-400 text-center">
            No video to display. Please upload a video first.
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4 w-full max-w-3xl mt-8">
        <button
          onClick={handleBack}
          className="flex px-6 py-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition"
        >
          Back
        </button>
        {videoSrc && (
          <button
            onClick={() => navigate("/editor", { state: { videoSrc } })}
            className="flex px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Animate
          </button>
        )}
      </div>
    </section>
  );
};

export default PreviewPage;
