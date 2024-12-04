import * as THREE from 'three';

const extractSkeletonData = (fbx) => {
  const skeletonData = [];
  
  let hipPosition = null;
  let hipRotation = null;

  // Traverse through all the bones in the FBX model
  fbx.traverse((object) => {
    if (object.isBone) {
      const worldPosition = new THREE.Vector3();
      const worldQuaternion = new THREE.Quaternion();

      object.getWorldPosition(worldPosition);
      object.getWorldQuaternion(worldQuaternion);

      const worldRotation = new THREE.Euler();
      worldRotation.setFromQuaternion(worldQuaternion);

      if (object.name === 'hip') {
        hipPosition = worldPosition.clone();
        hipRotation = worldRotation.clone();
      }

      const parentPosition = object.parent ? object.parent.position : new THREE.Vector3();
      const boneLength = object.position.distanceTo(parentPosition);

      skeletonData.push({
        name: object.name,
        parent: object.parent?.name || null,
        position: {
          x: worldPosition.x,
          y: worldPosition.y,
          z: worldPosition.z,
        },
        rotation: {
          x: THREE.MathUtils.radToDeg(worldRotation.x),
          y: THREE.MathUtils.radToDeg(worldRotation.y),
          z: THREE.MathUtils.radToDeg(worldRotation.z),
        },
        boneLength,
      });
    }
  });

  const result = {
    hip: {
      position: {
        x: hipPosition?.x || 0,
        y: hipPosition?.y || 0,
        z: hipPosition?.z || 0,
      },
      rotation: {
        x: hipRotation?.x || 0,
        y: hipRotation?.y || 0,
        z: hipRotation?.z || 0,
      },
    },
    bones: skeletonData,
  };

  // Send data to backend via POST request
  fetch('http://localhost:5000/api/saveSkeletonData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(result),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Skeleton data saved successfully:', data);
    })
    .catch((error) => {
      console.error('Error saving skeleton data to backend:', error);
    });

  return result;
};

export default extractSkeletonData;
