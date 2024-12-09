import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { option, src, stream } = location.state || {};

  useEffect(() => {
    if (option === "live" && stream) {
      const videoElement = document.getElementById("liveVideo");
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.play();
      }
    }

    return () => {
      // Stop the camera stream when the component unmounts
      if (option === "live" && stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [option, stream]);

  return (
    <section className="h-screen bg-black text-white flex flex-col items-center justify-between px-4 py-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">Preview</h1>

      {/* Video Preview */}
      <div className="flex-1 w-full max-w-7xl bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        {option === "upload" && (
          <video
            controls
            autoPlay
            className="w-full h-full object-contain"
            src={src}
          />
        )}
        {option === "live" && (
          <video
            id="liveVideo"
            className="w-full h-full object-contain"
            autoPlay
            muted // Muting the camera feed prevents audio feedback
          />
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-4 w-full max-w-4xl mt-6">
        <button
          onClick={() => navigate("/create")}
          className="flex px-6 py-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition"
        >
          Back
        </button>
        <button
          onClick={() => navigate("/editor")}
          className="flex px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Animate
        </button>
      </div>
    </section>
  );
};

export default PreviewPage;
