# Human Action Transfer to 3D Model

Welcome to the **Human Action Transfer to 3D Model** repository! This project focuses on transferring human motion captured from video or live camera to a 3D model in real-time, leveraging modern web and backend technologies for seamless performance and interactive rendering.

## 🚀 Features

- **3D Pose Estimation**: Uses BlazePose3D to extract 3D keypoints from video or live camera feeds.
- **Mapping Algorithm**: Transforms 3D poses into formats suitable for rendering and animation.
- **Real-Time Rendering**: Implements Three.js for high-quality, real-time 3D model animations.
- **Frontend and Backend Architecture**:
  - Frontend: Built with React and Three.js for interactive visualization.
  - Backend: Node.js and Express for real-time video processing and API handling.
  - Database: PostgreSQL for managing data.

## 🛠️ Tech Stack

- **Frontend**: React, Three.js
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Pose Estimation**: BlazePose3D

## 📂 Project Structure

```plaintext
Human-Action-Transfer-to-3D-Model/
├── frontend/           # Frontend source code (React, Three.js)
│   ├── src/
│   │   ├── components/ # React components
│   │   └── ...         # Other frontend assets
│   └── package.json    # Frontend dependencies
├── backend/            # Backend source code (Node.js, Express)
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions (pose estimation, mapping, etc.)
│   ├── uploads/        # Uploaded video files
│   ├── output/         # Processed data and results
│   ├── server.js       # Main server file
│   └── package.json    # Backend dependencies
└── README.md           # Project documentation
```

### Backend Folder Details
- **routes/**: Contains API endpoints for pose estimation, video uploads, and data processing.
- **utils/**: Includes scripts for extracting 3D keypoints, filtering, interpolation, and joint transformation.
- **uploads/**: Stores uploaded videos or live camera feeds for processing.
- **output/**: Saves processed keypoints and other output data.

## 📖 How to Use

### Prerequisites

1. Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).
2. Install PostgreSQL for database setup.
3. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/Human-Action-Transfer-to-3D-Model.git
   cd Human-Action-Transfer-to-3D-Model
   ```

### Installation

#### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   nodemon server.js
   ```

#### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### Workflow

1. **3D Pose Estimation**:
   - Backend processes input video or live camera feed using BlazePose3D to extract 3D keypoints.
2. **Mapping and Processing**:
   - Backend applies mapping algorithms to transform 3D poses into animation-ready data.
3. **Rendering**:
   - Processed data is sent to the frontend, where Three.js renders the animated 3D model in real-time.

## 📊 Results

### Examples
- **Input Video**: Upload via frontend interface.
- **3D Keypoints**: Processed in backend and visualized in real-time on the web.
- **3D Animation**: ![Sample Animation](path/to/sample/image)

## 🗺️ Roadmap

- [ ] Integrate live camera feed for real-time pose estimation.
- [ ] Enhance mapping algorithms for smoother animations.
- [ ] Add support for additional datasets and models.
- [ ] Implement advanced rendering techniques using WebGL.

## 🤝 Contributing

We welcome contributions! Feel free to open issues, suggest features, or submit pull requests.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙌 Acknowledgments

- BlazePose3D for pose estimation
- Three.js for 3D rendering
- Node.js and Express for backend development
- PostgreSQL for database management

---

Feel free to reach out with questions or suggestions. Enjoy animating!
