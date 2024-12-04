import mapping from '../mapping.json';  // import the mapping file

export function mapKeypointsToBones(keypointsData) {
  const bones = {};  // Object to hold the bone positions

  // Iterate through keypoints for a specific frame (001 in this case)
  const frameKeypoints = keypointsData.keypoints["001"];

  // Map each keypoint to the corresponding bone
  for (const [keypointName, { x, y, z }] of Object.entries(frameKeypoints)) {
    const boneName = mapping[keypointName];
    if (boneName) {
      bones[boneName] = { x, y, z };  // Assign the coordinates to the respective bone
    }
  }

  return bones;
}
