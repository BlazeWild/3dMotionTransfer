import React from "react";

const Homepage = () => {
  const handleCreateProject = () => {
    window.open("/create", "_blank"); // Open in a new tab
  };

  return (
    <section className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-700 text-white">
      <div className="text-center space-y-6 max-w-4xl px-6">
        <h1 className="text-5xl font-bold">
          Welcome to 3D Motion Transfer Project
        </h1>
        <p className="text-lg">
          Seamlessly animate rigged 3D models using motion data extracted from videos or real-time camera feeds.
        </p>
        <button
          onClick={handleCreateProject}
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all"
        >
          Create a Project
        </button>
      </div>
    </section>
  );
};

export default Homepage;
