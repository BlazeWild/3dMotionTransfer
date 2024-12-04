import React, { useRef, useState, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { AnimationMixer } from "three";
import axios from "axios";
import * as THREE from "three";

// Import the bone mapping dynamically from the JSON file
import mapping from './mapping.json';

const FBXWithAnimation = ({ modelPath, scale, position, rotation }) => {
  const [keypoints, setKeypoints] = useState({});
  const [skeletonReady, setSkeletonReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const mixerRef = useRef();
  const fbxRef = useRef();

  // Function to fetch keypoints from the server
  const fetchKeypoints = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/3dkeypoints");
      setKeypoints(response.data.keypoints["001"]);  // Replace with the correct keypoints ID if needed
      console.log("Keypoints fetched:", response.data.keypoints["001"]);
    } catch (error) {
      console.error("Error fetching keypoints:", error);
    }
  };

  const updateBoneWorldPositions = (fbx, keypoints) => {
    // Traverse through all bones in the FBX model
    fbx.traverse((object) => {
      if (object.isBone) {
        // Get the mapped keypoint name for the bone
        const boneName = mapping[object.name.toUpperCase()];
  
        // Check if the keypoint exists for the bone and if the visibility is above threshold
        if (keypoints["001"] && keypoints["001"][boneName] && keypoints["001"][boneName].visibility > 0.9) {
          // Extract the x, y, z coordinates for the keypoint
          const { x, y, z } = keypoints["001"][boneName];
  
          // Normalize and convert coordinates for the 3D space
          const targetWorldPosition = new THREE.Vector3(
            x * 2 - 1,  // Normalize to [-1, 1]
            (1 - y) * 2 - 1,  // Invert y-axis and normalize
            z
          );
  
          // Apply the parent world matrix to convert the position to local space
          const parentWorldMatrix = object.parent.matrixWorld;
          const localPosition = targetWorldPosition.clone();
          localPosition.applyMatrix4(new THREE.Matrix4().copy(parentWorldMatrix).invert());
  
          // Update the bone's local position based on the calculated local position
          object.position.set(localPosition.x, localPosition.y, localPosition.z);
  
          // Ensure the bone's world position is updated
          object.updateMatrixWorld(true);
        }
      }
    });
  };
  
  
  // Load the FBX model
  const fbx = useLoader(FBXLoader, modelPath);
  useEffect(() => {
    if (fbx) {
      console.log("FBX model loaded:", fbx);

      // Set the initial transformations
      fbx.scale.set(scale, scale, scale);
      fbx.position.set(...position);
      fbx.rotation.set(...rotation);

      fbxRef.current = fbx;

      // Directly access bones and map them
      const bones = [];
      fbx.traverse((object) => {
        if (object.isBone) {
          console.log(`Bone: ${object.name}, World Position: ${object.getWorldPosition(new THREE.Vector3()).toArray()}`);
          bones.push(object);
        }
      });

      // Update the state for bones (you can use this list to map keypoints)
      if (bones.length > 0) {
        console.log("Bones found in model:", bones);
      }

      // Set up animation mixer
      mixerRef.current = new AnimationMixer(fbx);

      // Fetch initial keypoints from the server
      fetchKeypoints();
      setModelLoaded(true);
    }
  }, [fbx, scale, position, rotation]);

  useFrame(() => {
    // Ensure the model is loaded
    if (!modelLoaded) {
      console.log("Model not loaded yet");
      return;
    }
  
    // Ensure keypoints are fetched and available
    if (!keypoints || Object.keys(keypoints).length === 0) {
      console.log("Keypoints are not available yet");
      return;
    }
  
    // Log the keypoints object to see its structure (this will run only when available)
    console.log("Keypoints object:", keypoints);
  
    // Get keypoints for frame 001
    const frameKeypoints = keypoints["001"];
    
    // Ensure frame 001 keypoints are available
    if (!frameKeypoints) {
      console.log("No keypoints available for frame 001");
      return;
    }
  
    // Iterate through the keypoints of frame 001 and log them
    Object.keys(frameKeypoints).forEach(boneName => {
      const { x, y, z } = frameKeypoints[boneName];
      console.log(`Bone: ${boneName}`);
      console.log(`Keypoints for ${boneName}: (${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)})`);
    });
  
    // You can also update bone world positions here based on fetched keypoints
    updateBoneWorldPositions(fbxRef.current, frameKeypoints);
  });
  
  
  return <primitive object={fbx} />;
};

export default FBXWithAnimation;
