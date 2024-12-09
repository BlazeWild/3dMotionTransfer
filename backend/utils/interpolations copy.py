import json
import numpy as np

# Normalize vector
def normalize_vector(vector):
    norm = np.linalg.norm(vector)
    if norm == 0:
        return np.zeros(3)
    return vector / norm

# Interpolate missing joint positions (like HIPS, SPINE, etc.)
def interpolate_missing_joints(landmarks, bone_lengths):
    interpolated_joints = {}

    # Interpolate HIPS (midpoint of LEFT_HIP and RIGHT_HIP, or use existing HIP if available)
    if "LEFT_HIP" in landmarks and "RIGHT_HIP" in landmarks:
        interpolated_joints["HIPS"] = (landmarks["LEFT_HIP"] + landmarks["RIGHT_HIP"]) / 2
    elif "HIP" in landmarks:
        interpolated_joints["HIPS"] = landmarks["HIP"]
    else:
        print("Warning: LEFT_HIP, RIGHT_HIP, or HIP missing for HIPS interpolation")

    # Interpolate NECK (midpoint of LEFT_SHOULDER and RIGHT_SHOULDER)
    if "LEFT_SHOULDER" in landmarks and "RIGHT_SHOULDER" in landmarks:
        interpolated_joints["NECK"] = (landmarks["LEFT_SHOULDER"] + landmarks["RIGHT_SHOULDER"]) / 2
    else:
        print("Warning: LEFT_SHOULDER or RIGHT_SHOULDER missing for NECK interpolation")

    # Interpolate SPINE, SPINE1, SPINE2 based on bone lengths
    if "HIPS" in interpolated_joints:
        hips_pos = interpolated_joints["HIPS"]

        # Interpolating SPINE
        interpolated_joints["SPINE"] = hips_pos + np.array([0, bone_lengths["Hips-Spine"], 0])

        # Interpolating SPINE1
        interpolated_joints["SPINE1"] = interpolated_joints["SPINE"] + np.array([0, bone_lengths["Spine-Spine1"], 0])

        # Interpolating SPINE2
        interpolated_joints["SPINE2"] = interpolated_joints["SPINE1"] + np.array([0, bone_lengths["Spine1-Spine2"], 0])

    # Return interpolated joint positions
    return interpolated_joints

# Load the keypoints from 3dkeypoints.json
def load_keypoints(path):
    with open(path, "r") as file:
        return json.load(file)

# Load joint hierarchy from joint_hierarchy.json
def load_joint_hierarchy(path):
    with open(path, "r") as file:
        return json.load(file)

# Calculate rotations (direction) for each bone based on child-parent relationships
def calculate_bone_rotations(keypoints, joint_hierarchy):
    bone_rotations = {}

    for joint, data in joint_hierarchy.items():
        parent_joint = data["parent"]

        if parent_joint is None:
            continue  # No rotation for the root joint (HIPS)

        # Calculate rotation direction from parent joint to current joint
        if joint in keypoints and parent_joint in keypoints:
            parent_pos = np.array(keypoints[parent_joint])
            current_pos = np.array(keypoints[joint])
            direction = normalize_vector(current_pos - parent_pos)
            bone_rotations[joint] = direction.tolist()

    return bone_rotations

# Process the keypoints, interpolate joints, and calculate bone rotations for each frame
def process_keypoints(keypoints_path, joint_hierarchy_path, bone_lengths, rotations_output_path):
    # Load keypoints and joint hierarchy
    keypoints_data = load_keypoints(keypoints_path)
    joint_hierarchy = load_joint_hierarchy(joint_hierarchy_path)

    # Initialize a dictionary to store the bone rotations for each frame
    all_bone_rotations = {}

    # Iterate over each frame in keypoints data
    for frame, landmarks in keypoints_data.items():
        # Convert landmark data to numpy-friendly format (coordinates in np.array)
        keypoints = {key.upper(): np.array([value["x"], value["y"], value["z"]]) for key, value in landmarks.items()}

        # Interpolate missing joint positions (e.g., HIPS, SPINE, NECK)
        interpolated_joints = interpolate_missing_joints(keypoints, bone_lengths)

        # Combine original keypoints with interpolated joints
        all_joints = {**keypoints, **interpolated_joints}

        # Calculate rotations for bones (excluding root)
        bone_rotations = calculate_bone_rotations(all_joints, joint_hierarchy)

        # Store bone rotations for the frame
        all_bone_rotations[frame] = bone_rotations

    # Save bone rotations to the output file
    with open(rotations_output_path, "w") as file:
        json.dump(all_bone_rotations, file, indent=4)

    # Print the bone rotations for each frame
    for frame, rotations in all_bone_rotations.items():
        print(f"Frame {frame}:")
        for bone, rotation in rotations.items():
            print(f"  Bone {bone} rotation: {rotation}")

# Example usage:
keypoints_path = r"backend\output\3dkeypoints.json"  # Path to the 3D keypoints JSON file
joint_hierarchy_path = r"backend\output\Source trans\joint_hierarchy.json"  # Path to the joint hierarchy JSON file
rotations_output_path = r"backend\output\Source trans\rotations.json"  # Path to save the rotations file

# Bone lengths (provided)
bone_lengths = {
    "Hips-Spine": 0.2954192832112332,
    "Spine-Spine1": 0.3914922754177804,
    "Spine1-Spine2": 0.3654189059040484,
    "Spine2-Neck": 0.466724731783455,
}

# Process the keypoints and calculate bone rotations, then save and print them
process_keypoints(keypoints_path, joint_hierarchy_path, bone_lengths, rotations_output_path)
