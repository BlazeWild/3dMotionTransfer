import json
import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/keypoints", methods=["GET"])
def get_keypoints():
    # Full path to keypoints.json
    keypoints_path = "keypoints.json"
    
    # Debug: Print current working directory to confirm file location
    print(f"Current working directory: {os.getcwd()}")
    print(f"Looking for file at: {os.path.abspath(keypoints_path)}")
    
    try:
        # Try to open the keypoints.json file and load the data
        with open(keypoints_path, "r") as f:
            keypoints = json.load(f)
            print("Keypoints loaded successfully")
        
        # Return the JSON data with frames and keypoints
        return jsonify({"status": "success", "keypoints": keypoints})
    
    except FileNotFoundError:
        # Handle the case where the file doesn't exist
        print(f"File not found: {keypoints_path}")
        return jsonify({"status": "error", "message": "Keypoints not found"}), 404
    
    except json.JSONDecodeError as e:
        # Handle invalid JSON file errors
        print(f"JSON Decode Error: {e}")
        return jsonify({"status": "error", "message": "Error decoding JSON"}), 500


@app.route("/3dkeypoints", methods=["GET"])
def get_3dkeypoints():
    # Full path to 3dkeypoints.json
    keypoints_path = "3dkeypoints.json"
    
    # Debug: Print current working directory to confirm file location
    print(f"Current working directory: {os.getcwd()}")
    print(f"Looking for file at: {os.path.abspath(keypoints_path)}")
    
    try:
        # Try to open the 3dkeypoints.json file and load the data
        with open(keypoints_path, "r") as f:
            keypoints = json.load(f)
            print("3D Keypoints loaded successfully")
        
        # Return the JSON data with frames and 3D keypoints
        return jsonify({"status": "success", "keypoints": keypoints})
    
    except FileNotFoundError:
        # Handle the case where the file doesn't exist
        print(f"File not found: {keypoints_path}")
        return jsonify({"status": "error", "message": "3D Keypoints not found"}), 404
    
    except json.JSONDecodeError as e:
        # Handle invalid JSON file errors
        print(f"JSON Decode Error: {e}")
        return jsonify({"status": "error", "message": "Error decoding JSON"}), 500


if __name__ == "__main__":
    # Run the Flask app on localhost and port 5000
    app.run(debug=True)
