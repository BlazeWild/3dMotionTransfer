import * as THREE from 'three';
import axios from 'axios';

const extractBoneTransforms = (fbx) => {
  const boneTransforms = new Map(); // Using a Map to store unique bones by name

  // Recursive function to traverse bones and compute relative transformations
  const traverseBones = (bone, parent = null) => {
    // Compute world position
    const worldPosition = new THREE.Vector3();
    bone.getWorldPosition(worldPosition);
    const localQuaternion = bone.quaternion.clone();

    const boneData = {
      name: bone.name,
      worldPosition: {
        x: worldPosition.x,
        y: worldPosition.y,
        z: worldPosition.z,
      },
      localRotation: new THREE.Euler().setFromQuaternion(localQuaternion).toArray(), // [x, y, z]
    };

    // Add to Map if bone name not already present
    if (!boneTransforms.has(bone.name)) {
      boneTransforms.set(bone.name, boneData);
    }

    // Traverse child bones
    bone.children.forEach((child) => {
      if (child.type === 'Bone') {
        traverseBones(child, bone); // Pass current bone as the parent
      }
    });
  };

  // Start traversal from the root bone (e.g., Hips or Armature)
  const rootBone = fbx.getObjectByName('Hips') || fbx;
  if (rootBone) {
    traverseBones(rootBone);
  } else {
    console.error('No root bone found in the FBX structure.');
  }

  // Convert Map values to array
  const uniqueBoneTransforms = Array.from(boneTransforms.values());

  // Debug: Log unique bone transforms
  console.log('Unique Bone Transforms:', JSON.stringify(uniqueBoneTransforms, null, 2));

  // Send data to backend
  axios.post('http://localhost:5000/api/fbxdata', { boneData: uniqueBoneTransforms })
    .then((response) => {
      console.log('Bone data saved successfully:', response.data);
    })
    .catch((error) => {
      console.error('Error saving bone data:', error);
    });

  return uniqueBoneTransforms;
};

export default extractBoneTransforms;
