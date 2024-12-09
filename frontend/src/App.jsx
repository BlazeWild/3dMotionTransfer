import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import ProjectEditor from "./components/ProjectEditor";
import { CreatePage } from "./components";
import {PreviewPage} from "./components";

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary overflow-x-hidden">
        <Routes>
          {/* Route for Homepage */}
          <Route path="/" element={<Homepage />} />
          <Route path="/editor" element={<ProjectEditor />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/preview" element={<PreviewPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
