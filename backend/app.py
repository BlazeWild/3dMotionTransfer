import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

# Enable CORS for all routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/keypoints")
async def get_keypoints():
    """Retrieve keypoints from keypoints.json."""
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

@app.get("/3dkeypoints")
async def get_3dkeypoints():
    """Retrieve 3D keypoints from 3dkeypoints.json."""
    keypoints_path = "3dkeypoints.json"

    # Debug: Print current working directory and file location
    print(f"Current working directory: {os.getcwd()}")
    print(f"Looking for file at: {os.path.abspath(keypoints_path)}")

    try:
        # Try to open the 3dkeypoints.json file and load the data
        with open(keypoints_path, "r") as f:
            keypoints = json.load(f)
            print("3D Keypoints loaded successfully")

        # Return the JSON data with frames and 3D keypoints
        return JSONResponse(content={"status": "success", "keypoints": keypoints})

    except FileNotFoundError:
        # Handle the case where the file doesn't exist
        print(f"File not found: {keypoints_path}")
        raise HTTPException(status_code=404, detail="3D Keypoints not found")

    except json.JSONDecodeError as e:
        # Handle invalid JSON file errors
        print(f"JSON Decode Error: {e}")
        raise HTTPException(status_code=500, detail="Error decoding JSON")


# To run the app:
# `uvicorn app_name:app --reload`
