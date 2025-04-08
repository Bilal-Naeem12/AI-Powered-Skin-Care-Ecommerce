import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import useFaceScanStore from "../../store/useFaceScanStore"; // ✅ Zustand store
const FaceScanner = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);       // Main canvas (used for capture)
  const overlayRef = useRef(null);      // Overlay canvas (for oval)
  const cameraRef = useRef(null);
  const {
    faceInsideOval, 
    facingCamera,
    lightingOk,
  } = useFaceScanStore.getState();
  const setFaceInsideOval = useFaceScanStore((state) => state.setFaceInsideOval);
  const setFacingCamera = useFaceScanStore((state) => state.setFacingCamera);
  const setLightingOk = useFaceScanStore((state) => state.setLightingOk);

  const isInsideOval = (x, y, ovalX, ovalY, width, height) => {
    const dx = x - ovalX;
    const dy = y - ovalY;
    return ((dx * dx) / ((width / 2) ** 2) + (dy * dy) / ((height / 2) ** 2)) <= 1;
  };

  const avgBrightness = () => {
    const ctx = canvasRef.current.getContext("2d");
    const frame = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    let total = 0;
    for (let i = 0; i < frame.data.length; i += 4) {
      const r = frame.data[i];
      const g = frame.data[i + 1];
      const b = frame.data[i + 2];
      const brightness = (r + g + b) / 3;
      total += brightness;
    }
    return total / (frame.data.length / 4);
  };

  useImperativeHandle(ref, () => ({
    captureSnapshot: () => {
      if (!faceInsideOval || !facingCamera || !lightingOk) {
        console.warn("🚫 Capture blocked: Constraint failed");
        return null;
      }
      return canvasRef.current?.toDataURL("image/jpeg"); // Clean image only
    },
    stopCamera: () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
        console.log("📷 Camera stopped");
      }
    },
  }));

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

    faceMesh.onResults((results) => {
      const ctx = canvasRef.current?.getContext("2d");
      const overlay = overlayRef.current?.getContext("2d");
      if (!ctx || !results.image || !overlay) return;
    
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
      // Clear and draw oval on overlay only
      overlay.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2;
      const ovalWidth = 160;
      const ovalHeight = 200;
    
      overlay.beginPath();
      overlay.ellipse(centerX, centerY, ovalWidth / 2, ovalHeight / 2, 0, 0, 2 * Math.PI);
      overlay.strokeStyle = "rgba(0, 0, 0, 0.5)";
      overlay.lineWidth = 3;
      overlay.stroke();
    
      const landmarks = results.multiFaceLandmarks?.[0];
    
      if (landmarks) {
        const nose = landmarks[1];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
    
        const px = nose.x * canvasRef.current.width;
        const py = nose.y * canvasRef.current.height;
        const insideOval = isInsideOval(px, py, centerX, centerY, ovalWidth, ovalHeight);
        setFaceInsideOval(insideOval);
    
        const dLeft = Math.abs(leftEye.x - nose.x);
        const dRight = Math.abs(rightEye.x - nose.x);
        const isFacing = Math.abs(dLeft - dRight) < 0.05;
        setFacingCamera(isFacing);
      } else {
        setFaceInsideOval(false);
        setFacingCamera(false);
      }
    
      const isBright = avgBrightness() > 50;
      setLightingOk(isBright);
    });
    
    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 300,
        height: 400,
      });
      camera.start();
      cameraRef.current = camera;
    }

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
        console.log("📷 Camera stopped on unmount");
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        width={300}
        height={400}
      />
      <canvas
        ref={overlayRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        width={300}
        height={400}
      />
    </div>
  );
});

export default FaceScanner;
