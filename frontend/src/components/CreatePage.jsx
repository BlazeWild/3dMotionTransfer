import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const navigate = useNavigate();

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewSrc(URL.createObjectURL(file));
      setSelectedOption("upload");
      navigate("/preview", { state: { option: "upload", src: URL.createObjectURL(file) } });
    }
  };

  const handleLiveCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      navigate("/preview", { state: { option: "live", stream } });
    } catch (error) {
      alert("Unable to access camera.");
      console.error(error);
    }
  };

  return (
    <section className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-2">Create Your Project</h1>
        <p className="text-lg text-gray-300">
          Choose between uploading a video or using a live camera feed for preview.
        </p>
      </div>

      <div className="flex justify-center items-center gap-8 mb-6 flex-wrap w-full">
        <div
          className="w-1/2 h-48 bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer flex flex-col items-center justify-center hover:bg-gray-700"
        >
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
        </div>

        <div
          className="w-1/2 h-48 bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer flex flex-col items-center justify-center hover:bg-gray-700"
          onClick={handleLiveCamera}
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
