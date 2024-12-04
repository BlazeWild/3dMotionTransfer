import numpy as np

def compute_local_positions(joint_data, hierarchy):
    """
    Compute local positions for each joint relative to its parent.
    """
    local_positions = {}
    for joint, data in joint_data.items():
        parent = hierarchy.get(joint)
        if parent:
            local_positions[joint] = data["position"] - joint_data[parent]["position"]
        else:  # Root joint
            local_positions[joint] = data["position"]  # Global position remains
    return local_positions

from scipy.spatial.transform import Rotation as R

def compute_joint_orientations(local_positions, target_directions):
    orientations = {}
    for joint, direction in target_directions.items():
        source_direction = local_positions[joint]
        norm_source = source_direction / np.linalg.norm(source_direction)
        norm_target = direction / np.linalg.norm(direction)
        dot = np.dot(norm_source, norm_target)
        cross = np.cross(norm_source, norm_target)
        quaternion = np.append(cross, 1 + dot)  # Quaternion representation
        orientations[joint] = quaternion / np.linalg.norm(quaternion)  # Normalize
    return orientations
