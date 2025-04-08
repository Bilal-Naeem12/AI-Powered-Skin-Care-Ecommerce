import React, { useEffect, useRef } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const FaceScanner = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    let camera = null;
    if (typeof videoRef.current !== "undefined" && videoRef.current !== null) {
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 400,
        height: 500,
      });
      camera.start();
    }

    function onResults(results) {
      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      // Optional: draw landmarks for debugging
      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          for (let point of landmarks) {
            canvasCtx.beginPath();
            canvasCtx.arc(point.x * canvasRef.current.width, point.y * canvasRef.current.height, 1, 0, 2 * Math.PI);
            canvasCtx.fillStyle = "red";
            canvasCtx.fill();
          }
        }
      }

      canvasCtx.restore();
    }

    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, []);

  return (
    <div className="relative w-[400px] h-[500px]">
      <video ref={videoRef} className="absolute top-0 left-0 w-full h-full" autoPlay muted playsInline />
      <canvas ref={canvasRef} width="400" height="500" className="absolute top-0 left-0" />
    </div>
  );
};

export default FaceScanner;
