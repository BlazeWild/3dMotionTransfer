import * as THREE from 'three';
import fs from 'fs'; // Use fs to write the JSON file

const extractSkeletonData = (fbx) => {
  const skeletonData = [];

  let hipPosition = null; // To store the world position of the hip
  let hipRotation = null; // To store the world rotation of the hip

  fbx.traverse((object) => {
    if (object.isBone) {
      const worldPosition = new THREE.Vector3();
      const worldQuaternion = new THREE.Quaternion();

      // Safely retrieve the world position and rotation
      object.getWorldPosition(worldPosition);
      object.getWorldQuaternion(worldQuaternion);

      const worldRotation = new THREE.Euler();
      worldRotation.setFromQuaternion(worldQuaternion);

      // Collect data about the hip (assumed to be the root parent)
      if (object.name === 'hip') {
        hipPosition = worldPosition.clone(); // Store the hip position
        hipRotation = worldRotation.clone(); // Store the hip rotation
      }

      // Calculate the length of the bone by checking the distance to its parent
      const parentPosition = object.parent ? object.parent.position : new THREE.Vector3();
      const boneLength = object.position.distanceTo(parentPosition);

      // Collect data for the bone
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
        boneLength, // Add bone length
      });
    }
  });

  // Save hip position and rotation, along with child bone data to JSON
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

  // Save the result to a JSON file
  fs.writeFileSync('skeletonData.json', JSON.stringify(result, null, 2), 'utf-8');
  console.log('Skeleton data saved to skeletonData.json');

  return result;
};

export default extractSkeletonData;
