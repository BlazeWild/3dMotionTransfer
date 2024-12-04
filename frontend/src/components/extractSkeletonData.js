import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const FBXWithSkeletonData = ({ modelPath, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], onModelLoaded }) => {
  const meshRef = useRef();

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load(
      modelPath,
      (object) => {
        object.scale.set(scale, scale, scale);
        object.position.set(...position);
        object.rotation.set(...rotation);

        // Extract skeleton data if the model has a SkinnedMesh
        if (object instanceof THREE.SkinnedMesh) {
          extractSkeletonData(object);
        }

        if (meshRef.current) {
          meshRef.current.add(object);
        }
        if (onModelLoaded) {
          onModelLoaded(object); // Pass the loaded model to the parent
        }
      },
      undefined,
      (error) => {
        console.error('FBXLoader Error:', error);
      }
    );

    // Cleanup on component unmount
    return () => {
      if (meshRef.current) {
        meshRef.current.children.forEach((child) => {
          meshRef.current.remove(child); // Remove children manually
        });
      }
    };
  }, [modelPath, scale, position, rotation, onModelLoaded]);

  // Function to extract skeleton data (bone positions, rotations, and lengths)
  const extractSkeletonData = (object) => {
    const skeletalData = [];
    const skeleton = object.skeleton;
    const bones = skeleton.bones;

    bones.forEach((bone, index) => {
      const boneName = bone.name;
      const bonePosition = bone.getWorldPosition(new THREE.Vector3());
      const boneRotation = bone.getWorldRotation(new THREE.Euler());

      // Calculate bone length by finding the distance to the next bone
      let boneLength = 0;
      if (bones[index + 1]) {
        const nextBone = bones[index + 1];
        boneLength = bonePosition.distanceTo(nextBone.getWorldPosition(new THREE.Vector3()));
      }

      skeletalData.push({
        boneName,
        bonePosition: { x: bonePosition.x, y: bonePosition.y, z: bonePosition.z },
        boneRotation: { x: boneRotation.x, y: boneRotation.y, z: boneRotation.z },
        boneLength,
      });
    });

    // Log skeletal data (You can save this to a file or store it as needed)
    console.log(skeletalData);
  };

  return <group ref={meshRef} />;
};

export default FBXWithSkeletonData;
