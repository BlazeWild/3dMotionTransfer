import cv2
import mediapipe as mp
import json
import os
import sys

def extract_keypoints(video_path, output_path):
    if not os.path.exists(video_path):
        print(f"Error: Video file does not exist at {video_path}")
        return

    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(
        static_image_mode=False,
        model_complexity=2,
        enable_segmentation=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )
    mp_drawing = mp.solutions.drawing_utils

    cap = cv2.VideoCapture(video_path)
    keypoints = {}
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)

        frame_name = str(frame_count).zfill(3)

        if results.pose_landmarks:
            keypoints[frame_name] = {}
            for i, lmk in enumerate(results.pose_landmarks.landmark):
                landmark_name = mp_pose.PoseLandmark(i).name
                keypoints[frame_name][landmark_name] = {
                    'x': round(lmk.x, 4),
                    'y': round(lmk.y, 4),
                    'z': round(lmk.z, 4),
                    'visibility': round(lmk.visibility, 4),
                }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(keypoints, f, indent=4)

    cap.release()
    print(f"3D Keypoints extracted and saved to {output_path}")


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python extract_keypoints.py <video_path> <output_path>")
        sys.exit(1)

    video_path = sys.argv[1]
    output_path = sys.argv[2]
    extract_keypoints(video_path, output_path)