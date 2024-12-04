import React, { useRef, useState, useEffect } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { AnimationMixer } from 'three';
import axios from 'axios';
import * as THREE from 'three';
import extractSkeletonData from './extractSkeletalData';

const FBXWithAnimation = ({ modelPath, scale, position, rotation }) => {
  const [keypoints, setKeypoints] = useState({});
  const mixerRef = useRef();
  const [skeletonReady, setSkeletonReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Load FBX model
  const fbx = useLoader(FBXLoader, modelPath);

  useEffect(() => {
    if (fbx) {
      console.log("FBX model loaded:", fbx);

      fbx.scale.set(scale, scale, scale);
      fbx.position.set(...position);
      fbx.rotation.set(...rotation);

      const loggedBones = new Set(); // Use a Set to track logged bones

      // Traverse the FBX model and log world position and parent of each bone
      fbx.traverse((object) => {
        if (object.isBone) {
          // Ensure we only log the bone once
          if (!loggedBones.has(object.name)) {
            // Get the world position of the bone
            const worldPosition = new THREE.Vector3();
            object.getWorldPosition(worldPosition);
  
            console.log(`Bone: ${object.name}, World Position: x=${worldPosition.x}, y=${worldPosition.y}, z=${worldPosition.z}`);
            console.log(`Bone: ${object.name}, Parent: ${object.parent ? object.parent.name : 'None'}`);

            // Mark the bone as logged
            loggedBones.add(object.name);
          }
        }
      });

      if (fbx.skeleton) {
        console.log("FBX skeleton found:", fbx.skeleton);
        setSkeletonReady(true);
      } else {
        console.log("No skeleton found in FBX model.");
      }

      // Set up the animation mixer (if animation is available)
      const mixer = new AnimationMixer(fbx);
      mixerRef.current = mixer;

      // Fetch keypoints for frame 001
      const fetchKeypoints = async () => {
        try {
          console.log("Fetching keypoints for frame 001...");
          const response = await axios.get('http://127.0.0.1:8000/3dkeypoints');
          
          const keypointsForFrame = response.data.keypoints["001"];
          console.log("Successfully fetched keypoints for frame 001:", keypointsForFrame);
          setKeypoints(keypointsForFrame);
        } catch (error) {
          console.error("Error fetching keypoints:", error);
        }
      };

      fetchKeypoints(); // Fetch keypoints for frame 001 only
      setModelLoaded(true);  // Indicate the model is loaded
    }
  }, [fbx, scale, position, rotation]);

  useFrame(() => {
    if (fbx.skeleton && modelLoaded) {
      if (!skeletonReady) {
        console.log("FBX skeleton loaded");
        setSkeletonReady(true);
      }

      // Log the bone positions once after skeleton is ready
      if (!fbx.skeleton.logged) {
        console.log("FBX Model Skeleton Bone Positions:");
        fbx.skeleton.bones.forEach((bone) => {
          console.log(`Bone: ${bone.name}, Position: x=${bone.position.x}, y=${bone.position.y}, z=${bone.position.z}`);
        });
        fbx.skeleton.logged = true;
      }

      // Loop over keypoints and update corresponding bone positions
      Object.entries(keypoints).forEach(([key, value]) => {
        const bone = fbx.skeleton.getBoneByName(key);
        if (bone) {
          const x = value.x * 2 - 1;
          const y = (1 - value.y) * 2 - 1;
          const z = value.z;
          bone.position.set(x, y, z);
        }
      });
    }
  });

  return <primitive object={fbx} />;
};

export default FBXWithAnimation;
