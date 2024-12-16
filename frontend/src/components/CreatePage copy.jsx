import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("video", file);

      try {
        setIsUploading(true);
        setErrorMessage("");

        const response = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          navigate("/preview", { state: { videoSrc: result.videoUrl } });
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error || "Failed to upload video.");
        }
      } catch (error) {
        setErrorMessage("An error occurred while uploading the video.");
      } finally {
        setIsUploading(false);
      }
    } else {
      setErrorMessage("Please select a video file.");
    }
  };

  return (
    <section className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-2">Create Your Project</h1>
        <p className="text-lg text-gray-300">
          Choose between uploading a video or using a live camera feed for preview.
        </p>
      </div>

      {/* Options Section */}
      <div className="flex justify-center items-center gap-8 mb-6 flex-wrap w-full">
        {/* Upload Video Option */}
        <div className="w-1/2 h-48 bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer flex flex-col items-center justify-center hover:bg-gray-700">
          <img
            src="https://img.icons8.com/ios/50/ffffff/video-upload.png"
            alt="Upload"
            className="w-16 h-16 mb-2"
          />
          <h2 className="text-lg font-semibold mb-2">Upload Video</h2>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            id="videoUpload"
            onChange={handleVideoUpload}
          />
          <label
            htmlFor="videoUpload"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 cursor-pointer"
          >
            Choose File
          </label>
          {isUploading && <p className="text-sm text-gray-400 mt-2">Uploading...</p>}
          {errorMessage && <p className="text-sm text-red-400 mt-2">{errorMessage}</p>}
        </div>

        {/* Live Camera Option */}
        <div
          className="w-1/2 h-48 bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer flex flex-col items-center justify-center hover:bg-gray-700"
          onClick={() => alert("Live Camera functionality not implemented yet.")}
        >
          <img
            src="https://img.icons8.com/ios/50/ffffff/camcorder.png"
            alt="Live Camera"
            className="w-16 h-16 mb-2"
          />
          <h2 className="text-lg font-semibold mb-2">Live Camera</h2>
          <p className="text-sm text-gray-300 text-center">
            Start camera feed for real-time preview.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CreatePage;
