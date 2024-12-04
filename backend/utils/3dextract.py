import cv2
import mediapipe as mp
import json
import os

# Define paths relative to the script's location
script_dir = os.path.abspath(os.path.dirname(__file__))  # Get the directory of the script
video_path = os.path.join(script_dir, "../uploads/video.mp4")  # Path to the video
output_path = os.path.join(script_dir, "../output/3dkeypoints.json")  # Path for the JSON output

def extract_keypoints(video_path, output_path):
    # Check if the video file exists
    if not os.path.exists(video_path):
        print(f"Error: Video file does not exist at {video_path}")
        return

    # Initialize MediaPipe BlazePose model
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(
        static_image_mode=False,
        model_complexity=2,
        enable_segmentation=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )
    mp_drawing = mp.solutions.drawing_utils

    # Open the video file
    cap = cv2.VideoCapture(video_path)
    keypoints = {}  # Dictionary to store the 3D keypoints
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        # Convert the BGR image to RGB for MediaPipe processing
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)

        # Format frame_count with leading zeros (e.g., 000, 001, 002, ...)
        frame_name = str(frame_count).zfill(3)

        if results.pose_landmarks:
            keypoints[frame_name] = {}
            for i, lmk in enumerate(results.pose_landmarks.landmark):
                # Get the name of the landmark from the index
                landmark_name = mp_pose.PoseLandmark(i).name
                keypoints[frame_name][landmark_name] = {
                    'x': round(lmk.x, 4),
                    'y': round(lmk.y, 4),
                    'z': round(lmk.z, 4),  # Include the z-coordinate (depth)
                    'visibility': round(lmk.visibility, 4)
                }

            # Draw the landmarks on the frame for visualization
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        # Display the frame with the landmarks
        cv2.imshow("Pose Detection", frame)

        # Wait for key press to continue to the next frame
        if cv2.waitKey(1) & 0xFF == ord('q'):  # Press 'q' to exit
            break

    # Save keypoints to JSON file
    os.makedirs(os.path.dirname(output_path), exist_ok=True)  # Ensure output directory exists
    with open(output_path, 'w') as f:
        json.dump(keypoints, f, indent=4)  # Save the dictionary as formatted JSON

    cap.release()
    cv2.destroyAllWindows()  # Close all OpenCV windows
    print(f"3D Keypoints extracted and saved to {output_path}")

# Example usage (used when script runs independently)
if __name__ == '__main__':
    extract_keypoints(video_path, output_path)
