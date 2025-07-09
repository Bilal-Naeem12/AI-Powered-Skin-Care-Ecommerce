// src/components/FaceScanner.tsx
import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import useFaceScanStore from "@/store/FaceScanStore";
import {
  FilesetResolver,
  FaceLandmarker,
  FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";

export interface FaceScannerHandle {
  captureSnapshot: () => string | null;
  stopCamera: () => void;
}

// Set your real capture/display size
const VIDEO_WIDTH = 800;
const VIDEO_HEIGHT = 700;
const OVAL_WIDTH = 400;
const OVAL_HEIGHT = 500;
const PREVIEW_WIDTH = 800;
const PREVIEW_HEIGHT = 700;


const cropStartX = Math.floor((VIDEO_WIDTH - PREVIEW_WIDTH) / 2);


const FaceScanner = forwardRef<FaceScannerHandle>((_, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
const cropCanvasRef = useRef<HTMLCanvasElement>(null);

  const setFaceInsideOval = useFaceScanStore((s) => s.setFaceInsideOval);
  const setFacingCamera    = useFaceScanStore((s) => s.setFacingCamera);
  const setLightingOk      = useFaceScanStore((s) => s.setLightingOk);

  const mediaStreamRef     = useRef<MediaStream | null>(null);
  const faceLandmarkerRef  = useRef<FaceLandmarker | null>(null);
  const rafIdRef           = useRef<number>(0);

 useImperativeHandle(ref, () => ({
  captureSnapshot: () => {
    const { faceInsideOval, facingCamera, lightingOk } = useFaceScanStore.getState();
    if (!faceInsideOval || !facingCamera || !lightingOk) return null;

    // Draw the cropped area onto the hidden crop canvas
    const cropCanvas = cropCanvasRef.current;
    const mainCanvas = canvasRef.current;
    if (!cropCanvas || !mainCanvas) return null;

    const cropCtx = cropCanvas.getContext("2d");
    if (!cropCtx) return null;

    cropCanvas.width = PREVIEW_WIDTH;
    cropCanvas.height = PREVIEW_HEIGHT;

    // Copy the cropped region from the main canvas
    cropCtx.clearRect(0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);
    cropCtx.drawImage(
      mainCanvas,
      cropStartX, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT, // source rect (main canvas)
      0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT           // dest rect (crop canvas)
    );

    return cropCanvas.toDataURL("image/jpeg");
  },
  stopCamera: () => {
    cancelAnimationFrame(rafIdRef.current);
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    faceLandmarkerRef.current?.close();
  },
}));

  const isInsideOval = (
    x: number, y: number,
    cx: number, cy: number,
    w: number, h: number
  ) => {
    const dx = x - cx, dy = y - cy;
    return dx*dx/(w/2)**2 + dy*dy/(h/2)**2 <= 1;
  };

  const avgBrightness = () => {
    const c = canvasRef.current;
    if (!c) return 0;
    const ctx = c.getContext("2d");
    if (!ctx) return 0;
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      sum += (data[i] + data[i+1] + data[i+2]) / 3;
    }
    return sum / (data.length/4);
  };

  useEffect(() => {
    let faceLandmarker: FaceLandmarker | null = null;
    let rafId: number = 0;

    const setupCamera = async () => {
      try {
        mediaStreamRef.current =
          await navigator.mediaDevices.getUserMedia({
            video: {
              width: VIDEO_WIDTH,
              height: VIDEO_HEIGHT,
              facingMode: "user",
            },
          });
        if (videoRef.current && mediaStreamRef.current) {
          videoRef.current.srcObject = mediaStreamRef.current;
          await videoRef.current.play();
        }
      } catch (e) {
        console.error("Camera error:", e);
      }
    };

    const setupModel = async () => {
      const visionFileset = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );
      faceLandmarker = await FaceLandmarker.createFromOptions(
        visionFileset,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/" +
              "face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
        }
      );
      faceLandmarkerRef.current = faceLandmarker;
    };

    const processFrame = (now: number) => {
      const video   = videoRef.current!;
      const canvas  = canvasRef.current!;
      const overlay = overlayRef.current!;
      const ctx     = canvas.getContext("2d")!;
      const ovCtx   = overlay.getContext("2d")!;

      ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -VIDEO_WIDTH, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
      ctx.restore();

      const results = faceLandmarker!.detectForVideo(video, now);

      ovCtx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
      ovCtx.beginPath();
      ovCtx.ellipse(
        VIDEO_WIDTH/2,
        VIDEO_HEIGHT/2,
        OVAL_WIDTH/2,
        OVAL_HEIGHT/2,
        0, 0, 2*Math.PI
      );
      ovCtx.strokeStyle = "rgba(0,0,0,0.7)";
      ovCtx.lineWidth   = 3;
      ovCtx.stroke();

      const multi = results.faceLandmarks;
      if (multi && multi.length) {
        const lm = multi[0];
        const pts = [1,10,152,234,454].map(i => ({
          x: (1-lm[i].x)*VIDEO_WIDTH,
          y: lm[i].y*VIDEO_HEIGHT
        }));
        setFaceInsideOval(pts.every(p =>
          isInsideOval(p.x,p.y,VIDEO_WIDTH/2,VIDEO_HEIGHT/2,OVAL_WIDTH,OVAL_HEIGHT)
        ));
        const lDist = Math.abs(lm[33].x - lm[1].x);
        const rDist = Math.abs(lm[263].x - lm[1].x);
        setFacingCamera(Math.abs(lDist - rDist) < 0.05);
      } else {
        setFaceInsideOval(false);
        setFacingCamera(false);
      }

      setLightingOk(avgBrightness() > 70);

      rafId = requestAnimationFrame(processFrame);
      rafIdRef.current = rafId;
    };

    const init = async () => {
      await setupCamera();
      await setupModel();
      rafId = requestAnimationFrame(processFrame);
      rafIdRef.current = rafId;
    };
    init();

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      mediaStreamRef.current?.getTracks().forEach(t => t.stop());
      faceLandmarkerRef.current?.close();
    };
  }, [setFaceInsideOval, setFacingCamera, setLightingOk]);

  // The outer card can be any size, but make sure the video/canvas/overlay
  // container is always at the true width/height!
  return (
<div className="flex items-center justify-center bg-white rounded-2xl shadow-lg w-full">
  <div
    className="relative rounded-xl overflow-hidden border border-gray-200 w-full"
    style={{
      aspectRatio: `${VIDEO_WIDTH} / ${VIDEO_HEIGHT}`,
      maxWidth: `${VIDEO_WIDTH}px`
    }}
  >
    <video
      ref={videoRef}
      className="absolute top-0 left-0 w-full h-full object-cover"
      style={{ transform: "scaleX(-1)" }}
      muted
      playsInline
      autoPlay
    />
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
    <canvas
      ref={overlayRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
    <canvas
      ref={cropCanvasRef}
      style={{ display: "none" }}
    />
  </div>
</div>

  );
});

export default FaceScanner;
