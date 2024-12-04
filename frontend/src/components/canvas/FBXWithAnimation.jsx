import React, { useRef, useState, useEffect } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { AnimationMixer } from 'three';
import axios from 'axios';
import * as THREE from 'three';

// Import the extractSkeletonData function
import extractSkeletonData from './extractSkeletalData';

const FBXWithAnimation = ({ modelPath, scale, position, rotation }) => {
  const [keypoints, setKeypoints] = useState({});
  const [modelLoaded, setModelLoaded] = useState(false);
  const mixerRef = useRef();
  const fbxRef = useRef();

  // Fetch keypoints for frame 001
  const fetchKeypoints = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/3dkeypoints');
      const keypointsForFrame = response.data.keypoints["001"]; // Assuming "001" is the desired frame
      console.log("Fetched keypoints for frame 001:", keypointsForFrame);
      setKeypoints(keypointsForFrame);
    } catch (error) {
      console.error("Error fetching keypoints:", error);
    }
  };

  // Load FBX model
  const fbx = useLoader(FBXLoader, modelPath);

  useEffect(() => {
    if (fbx) {
      console.log("FBX model loaded:", fbx);
  
      fbx.scale.set(scale, scale, scale);
      fbx.position.set(...position);
      fbx.rotation.set(...rotation);
  
      fbxRef.current = fbx;
  
      // Extract skeleton data after model is loaded
      try {
        const skeletonData = extractSkeletonData(fbx);
        console.log("Extracted Skeleton Data:", skeletonData);
      } catch (error) {
        console.error("Error extracting skeleton data:", error);
      }
  
      // Initialize the animation mixer (if animations are present)
      const mixer = new AnimationMixer(fbx);
      mixerRef.current = mixer;
  
      // Fetch keypoints
      fetchKeypoints();
      setModelLoaded(true);
    }
  }, [fbx, scale, position, rotation]);
  
  // Update bones' positions based on keypoints in each frame
  useFrame(() => {
    if (modelLoaded && keypoints) {
      // Ensure the skeleton is ready
      const skeleton = fbxRef.current?.skeleton;
      if (skeleton) {
        Object.entries(keypoints).forEach(([boneName, keypoint]) => {
          const bone = skeleton.getBoneByName(boneName);
          if (bone) {
            const { x, y, z } = keypoint;
            bone.position.set(x * 2 - 1, (1 - y) * 2 - 1, z); // Adjust scaling as necessary
            console.log(`Updated position for ${boneName}:`, bone.position);
          }
        });
      }
    }
  });

  return <primitive object={fbx} />;
};

export default FBXWithAnimation;
