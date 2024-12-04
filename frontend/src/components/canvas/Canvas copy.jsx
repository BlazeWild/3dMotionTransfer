import React from 'react';
import { Canvas } from '@react-three/fiber';
import FBXModel from './FBXModel';  // Import your FBXModel component
import { OrbitControls } from '@react-three/drei';

const CanvasComponent = () => {
  return (
    <Canvas
    frameloop="always"
    shadows
    camera={{ position: [7, 5, 5], fov: 50 }}
    gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      backgroundColor: 'transparent',
      
    }}
    >
        <OrbitControls 
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          enableDamping={true}
          dampingFactor={0.1}
          enablePan={false}
        />
      {/* Add lighting for the scene */}
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 10]} intensity={1} />

      {/* Add a camera to view the scene */}
      <perspectiveCamera position={[0, 0, 5]} />

      {/* Load your FBX model */}
      <FBXModel 
      modelPath="/models/ashok1.fbx" 
      scale={0.04} position={[0, -4, 0]} 
      rotation={[0, Math.PI / 4, 0]} />
    </Canvas>
  );
};

export default CanvasComponent;
