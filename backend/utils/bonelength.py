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

# Load JSON data from a file
def load_json(file_path):
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return None

# Save JSON data to a file
def save_json(data, file_path):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)
    print(f"Data successfully saved to {file_path}")

# Define base paths
base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
paths = {
    "hierarchy": os.path.join(base_path, "output", "modeldata", "hierarchy.json"),
    "data": os.path.join(base_path, "output", "modeldata", "data.json"),
    "output": os.path.join(base_path, "output", "modeldata", "bone_lengths.json"),
}

# Load hierarchy and bone data
hierarchy = load_json(paths["hierarchy"])
bone_data = load_json(paths["data"])

if not hierarchy or not bone_data:
    print("Error: Missing required input files. Exiting.")
    exit(1)

# Create a mapping of bone names to their world positions
bone_positions = {
    bone["name"]: bone["worldPosition"]  # Updated to use "worldPosition"
    for bone in bone_data["boneData"]
}

# Calculate bone lengths
bone_lengths = {
    f"{parent}-{child}": calculate_bone_length(bone_positions[parent], bone_positions[child])
    for parent, children in hierarchy.items()
    if parent in bone_positions
    for child in children
    if child in bone_positions
}

# Save the bone lengths to a new JSON file
output_data = {"bone_lengths": bone_lengths}
save_json(output_data, paths["output"])
