import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const VideoStream = () => {
    const canvasRef = useRef(null);
    const socket = io("http://localhost:5000"); // Update with your server URL

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        socket.on("frame", ({ image }) => {
            const img = new Image();
            img.src = `data:image/jpeg;base64,${image}`;
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <canvas ref={canvasRef} width={640} height={480} className="border" />
        </div>
    );
};

export default VideoStream;
