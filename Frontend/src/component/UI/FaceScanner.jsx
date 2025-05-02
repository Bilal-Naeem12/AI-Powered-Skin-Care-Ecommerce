import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import useFaceScanStore from "../../store/useFaceScanStore";

const FaceScanner = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const cameraRef = useRef(null);

  const { faceInsideOval, facingCamera, lightingOk } = useFaceScanStore.getState();
  const setFaceInsideOval = useFaceScanStore((state) => state.setFaceInsideOval);
  const setFacingCamera = useFaceScanStore((state) => state.setFacingCamera);
  const setLightingOk = useFaceScanStore((state) => state.setLightingOk);

  const isInsideOval = (x, y, ovalX, ovalY, width, height) => {
    const dx = x - ovalX;
    const dy = y - ovalY;
    return (
      ((dx * dx) / ((width / 2.3) ** 2) + (dy * dy) / ((height / 2.3) ** 2)) <= 1
    );
  };

  const avgBrightness = () => {
    const ctx = canvasRef.current.getContext("2d");
    const frame = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    let total = 0;
    for (let i = 0; i < frame.data.length; i += 4) {
      const brightness = (frame.data[i] + frame.data[i + 1] + frame.data[i + 2]) / 3;
      total += brightness;
    }
    return total / (frame.data.length / 4);
  };

  useImperativeHandle(ref, () => ({
    captureSnapshot: () => {
      if (!faceInsideOval || !facingCamera || !lightingOk) {
        console.warn("🚫 Capture blocked: Constraints not met");
        return null;
      }
      return canvasRef.current?.toDataURL("image/jpeg");
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
      if (!canvasRef.current || !overlayRef.current || !results.image) return;

      const ctx = canvasRef.current.getContext("2d");
      const overlay = overlayRef.current.getContext("2d");

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      overlay.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);

      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(results.image, -canvasRef.current.width, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.restore();

      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2;
      const ovalWidth = 200;
      const ovalHeight = 250;

      overlay.beginPath();
      overlay.ellipse(centerX, centerY, ovalWidth / 2, ovalHeight / 2, 0, 0, 2 * Math.PI);
      overlay.strokeStyle = "rgba(0, 0, 0, 0.7)";
      overlay.lineWidth = 3;
      overlay.stroke();

      const landmarks = results.multiFaceLandmarks?.[0];
      if (landmarks) {
        // Use key landmarks for full face check
        const keyIndices = [1, 10, 152, 234, 454]; // nose tip, forehead, chin, left cheek, right cheek
        const positions = keyIndices.map((index) => ({
          x: (1 - landmarks[index].x) * canvasRef.current.width, // flipped horizontally
          y: landmarks[index].y * canvasRef.current.height,
        }));

        const allInside = positions.every((pt) =>
          isInsideOval(pt.x, pt.y, centerX, centerY, ovalWidth, ovalHeight)
        );
        setFaceInsideOval(allInside);

        const dLeft = Math.abs(landmarks[33].x - landmarks[1].x);
        const dRight = Math.abs(landmarks[263].x - landmarks[1].x);
        const isFacing = Math.abs(dLeft - dRight) < 0.03;
        setFacingCamera(isFacing);
      } else {
        setFaceInsideOval(false);
        setFacingCamera(false);
      }

      const isBright = avgBrightness() > 100;
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
      }
      faceMesh.close();
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
        style={{ transform: "scaleX(-1)" }}
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
