import React from 'react';
import { Canvas } from '@react-three/fiber';
import FBXModel from './FBXModel';  // Import your FBXModel component
import { OrbitControls, useGLTF } from '@react-three/drei';
import FBXWithAnimation from './FBXWithAnimation';


const Floor=()=>{
  const floor = useGLTF('/assets/floor/scene.gltf');
  return(
    <primitive
      object={floor.scene}
      position={[0, -34, 0]}
      scale={[0.3, 0.5, 0.3]}
      rotation={[0, 0, 0]}
    />

  );
};


const CanvasComponent = () => {

  
  return (
    <Canvas
      frameloop="always"
      shadows
      camera={{ position: [100, 5, 5], fov: 50 }}
      gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }}
      style={{
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        // backgroundColor: 'transparent'
        backgroundColor: "#3C3C3C"
      }}
      fog={{
        type: 'linear', // or 'exp2'
        color: "#3C3C3C", // fog color (should match the background color)
        near: 1, // distance from camera where fog begins
        far: 2, // distance where fog reaches maximum intensity
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
      <ambientLight intensity={0.8} />
      <ambientLight intensity={1} />
      <ambientLight intensity={1} />
      {/* <directionalLight position={[10, 20, 10]} intensity={1} /> */}
      {/* Load your FBX model with animation */}
      <FBXWithAnimation 
        modelPath="/models/ashok1.fbx" 
        scale={0.3} 
        position={[0, -30, 0]} 
        rotation={[0, Math.PI/2, 0]} 
      />
      {/* Add the GLTF floor model */}
      <Floor />
    </Canvas>
  );
};

export default CanvasComponent;
