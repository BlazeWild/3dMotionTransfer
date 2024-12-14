# Updates and To-Do List

## Overview
This document outlines the key tasks and updates planned for the project, focusing on achieving enhanced functionality and accuracy in human action transfer to 3D models. Below is the structured to-do list followed by a detailed explanation of each step.

---

## 📝 Task List

1. **3D Pose Estimation with BlazePose3D**
2. **Correct BlazePose3D Output and Obtain Rotation Information**
3. **Obtain Extra Keypoints Through Interpolation or Fine-tuning BlazePose3D**
4. **Mapping Using ST-GCN or Manual Rotation Mapping**
5. **Rendering**

---

## 🔍 Detailed Explanation of Tasks

### 1. 3D Pose Estimation with BlazePose3D
- **Goal**: Utilize BlazePose3D for extracting 3D keypoints from video input or live camera feed.
- **Description**: BlazePose3D is the core algorithm for detecting human pose in 3D. The focus here is to implement and fine-tune BlazePose3D for real-time performance and accuracy. The output should provide a reliable 3D pose skeleton for further processing.
- **Steps**:
  - Load pre-trained BlazePose3D model.
  - Input video frames or live camera feed.
  - Extract 3D keypoints for the detected human subject.

### 2. Correct BlazePose3D Output and Obtain Rotation Information
- **Goal**: Refine the keypoint outputs from BlazePose3D to include joint rotation information.
- **Description**: BlazePose3D alone does not provide accurate rotation angles. This step involves using a Fully Connected CNN to predict rotation information based on the keypoints. 
- **Dataset**: Use MuPoTS dataset or other relevant datasets for training and validation.
- **Steps**:
  - Design and implement a Fully Connected CNN to predict joint rotations.
  - Train the model using annotated data from MuPoTS or provided datasets.
  - Integrate the model with BlazePose3D output for enhanced pose information.

### 3. Obtain Extra Keypoints Through Interpolation or Fine-tuning BlazePose3D
- **Goal**: Generate additional keypoints for more detailed animations.
- **Description**: Some critical keypoints may be missing from BlazePose3D output. This step involves:
  - Interpolating between detected keypoints to estimate missing ones.
  - Fine-tuning BlazePose3D to detect these extra keypoints directly.
- **Steps**:
  - Implement interpolation algorithms for generating plausible missing keypoints.
  - Fine-tune BlazePose3D model using an extended dataset to include the additional keypoints.

### 4. Mapping Using ST-GCN or Manual Rotation Mapping
- **Goal**: Map the 3D pose to the target 3D model for animation.
- **Description**: The extracted 3D keypoints and rotation data must be mapped to the corresponding joints of the target 3D model. This step involves either:
  - Using Spatial-Temporal Graph Convolutional Networks (ST-GCN) for learning the mapping relationship.
  - Applying manual rotation mapping techniques for explicit control.
  - Filter the jittering
- **Steps**:
  - Train an ST-GCN model with labeled pose-to-model data.
  - Alternatively, implement manual mapping by defining joint correspondences and applying rotation transforms.
  - Use pykalman or any low pass filter

### 5. Rendering
- **Goal**: Render the mapped 3D model in real-time.
- **Description**: Use Three.js or similar rendering libraries to display the animated 3D model on a web platform.
- **Steps**:
  - Import the mapped 3D pose data into Three.js.
  - Apply rotation and positional data to the 3D model joints.
  - Optimize rendering pipeline for real-time performance.

---

## 🔄 Next Steps
- Begin with BlazePose3D implementation and keypoint extraction.
- Set up training pipelines for the Fully Connected CNN and ST-GCN models.
- Evaluate the quality of interpolated keypoints and mapped animations.
- Integrate all components into a seamless workflow.

---

This document will be updated as progress is made on each task. Stay tuned for further developments!
