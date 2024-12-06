import json
import math
import os

# Function to calculate Euclidean distance between two points (bone length)
def calculate_bone_length(start, end):
    return math.sqrt(
        (end["x"] - start["x"])**2 +
        (end["y"] - start["y"])**2 +
        (end["z"] - start["z"])**2
    )

# Define paths dynamically
base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
hierarchy_path = os.path.join(base_path, "output", "modeldata", "hierarchy.json")
data_path = os.path.join(base_path, "output", "modeldata", "data.json")
output_path = os.path.join(base_path, "output", "modeldata", "bone_lengths.json")

# Load hierarchy and bone data
with open(hierarchy_path, "r") as f:
    hierarchy = json.load(f)

with open(data_path, "r") as f:
    bone_data = json.load(f)["boneData"]

# Create a mapping of bone names to their positions
bone_positions = {bone["name"]: bone["position"] for bone in bone_data}

# Calculate bone lengths
bone_lengths = {}
for parent, children in hierarchy.items():
    if parent in bone_positions:
        for child in children:
            if child in bone_positions:
                length = calculate_bone_length(bone_positions[parent], bone_positions[child])
                bone_lengths[f"{parent}-{child}"] = length

# Save the bone lengths to a new JSON file
output_data = {
    "bone_lengths": bone_lengths
}

# Ensure the output directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Write the bone lengths to file
with open(output_path, "w") as f:
    json.dump(output_data, f, indent=4)

print(f"Bone lengths saved to {output_path}")
