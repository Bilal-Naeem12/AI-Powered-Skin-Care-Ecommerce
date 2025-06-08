// src/components/FaceScanner.tsx
import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import useFaceScanStore from "@/store/useFaceScanStore";

export interface FaceScannerHandle {
  /** Returns a JPEG data URL of the current frame, or null if constraints not met */
  captureSnapshot: () => string | null;
  /** Stops the camera */
  stopCamera: () => void;
}

const FaceScanner = forwardRef<FaceScannerHandle>((_, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<any>(null);
  const faceMeshRef = useRef<any>(null);

  // Zustand store selectors
  const { faceInsideOval, facingCamera, lightingOk } =
    useFaceScanStore.getState();
  const setFaceInsideOval = useFaceScanStore((s) => s.setFaceInsideOval);
  const setFacingCamera = useFaceScanStore((s) => s.setFacingCamera);
  const setLightingOk = useFaceScanStore((s) => s.setLightingOk);

  // Imperative handle for parent components
  useImperativeHandle(ref, () => ({
    captureSnapshot: () => {
      if (!faceInsideOval || !facingCamera || !lightingOk) {
        console.warn("🚫 Capture blocked: Constraints not met");
        return null;
      }
      return canvasRef.current?.toDataURL("image/jpeg") ?? null;
    },
    stopCamera: () => {
      cameraRef.current?.stop();
      cameraRef.current = null;
      console.log("📷 Camera stopped");
    },
  }));

  // Utility: checks if (x,y) is inside an oval
  const isInsideOval = (
    x: number,
    y: number,
    centerX: number,
    centerY: number,
    width: number,
    height: number
  ): boolean => {
    const dx = x - centerX;
    const dy = y - centerY;
    return dx * dx / (width / 2) ** 2 + dy * dy / (height / 2) ** 2 <= 1;
  };

  // Utility: average brightness of current frame
  const avgBrightness = (): number => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let total = 0;
    for (let i = 0; i < frame.length; i += 4) {
      total += (frame[i] + frame[i + 1] + frame[i + 2]) / 3;
    }
    return total / (frame.length / 4);
  };

  useEffect(() => {
    let camera: any;
    let faceMesh: any;

    const setup = async () => {
      // Dynamically import the true ESM build
      const mp = await import(
        "@mediapipe/face_mesh/face_mesh.js"
      );
      const camUtils = await import(
        "@mediapipe/camera_utils/camera_utils.js"
      );
      const { FaceMesh } = mp;
      const { Camera } = camUtils;

      // Initialize FaceMesh
      faceMesh = new FaceMesh({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults((results: any) => {
        const canvas = canvasRef.current;
        const overlay = overlayRef.current;
        if (!canvas || !overlay || !results.image) return;

        const ctx = canvas.getContext("2d")!;
        const ovCtx = overlay.getContext("2d")!;

        // clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ovCtx.clearRect(0, 0, overlay.width, overlay.height);

        // draw mirrored frame
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
          results.image,
          -canvas.width,
          0,
          canvas.width,
          canvas.height
        );
        ctx.restore();

        // draw oval
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const w = 200;
        const h = 250;
        ovCtx.beginPath();
        ovCtx.ellipse(cx, cy, w / 2, h / 2, 0, 0, 2 * Math.PI);
        ovCtx.strokeStyle = "rgba(0, 0, 0, 0.7)";
        ovCtx.lineWidth = 3;
        ovCtx.stroke();

        // check landmarks
        const landmarks = results.multiFaceLandmarks?.[0];
        if (landmarks) {
          // key points: nose tip (1), forehead (10), chin (152), cheeks (234, 454)
          const keys = [1, 10, 152, 234, 454].map((i) => landmarks[i]);
          const positions = keys.map((lm: any) => ({
            x: (1 - lm.x) * canvas.width,
            y: lm.y * canvas.height,
          }));
          const inside = positions.every((p) =>
            isInsideOval(p.x, p.y, cx, cy, w, h)
          );
          setFaceInsideOval(inside);

          // facing camera?
          const leftDist = Math.abs(landmarks[33].x - landmarks[1].x);
          const rightDist = Math.abs(landmarks[263].x - landmarks[1].x);
          setFacingCamera(Math.abs(leftDist - rightDist) < 0.03);
        } else {
          setFaceInsideOval(false);
          setFacingCamera(false);
        }

        // lighting
        setLightingOk(avgBrightness() > 70);
      });

      // start camera
      if (videoRef.current) {
        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            await faceMesh.send({ image: videoRef.current! });
          },
          width: 300,
          height: 400,
        });
        camera.start();
        cameraRef.current = camera;
      }

      faceMeshRef.current = faceMesh;
    };

    setup();

    return () => {
      cameraRef.current?.stop();
      faceMeshRef.current?.close();
    };
  }, [setFaceInsideOval, setFacingCamera, setLightingOk]);

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
