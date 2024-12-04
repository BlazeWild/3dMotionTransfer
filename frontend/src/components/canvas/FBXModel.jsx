import React, { useEffect, useRef } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const FBXModel = ({ modelPath, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], onModelLoaded }) => {
  const meshRef = useRef();

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load(
      modelPath,
      (object) => {
        object.scale.set(scale, scale, scale);
        object.position.set(...position);
        object.rotation.set(...rotation);
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

  return <group ref={meshRef} />;
};

export default FBXModel;
