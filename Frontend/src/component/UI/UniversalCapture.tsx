import React, { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  FaceLandmarker,
} from "@mediapipe/tasks-vision";

interface Props {
  onCapture: (dataUrl: string) => void;
  onContinue: () => void;
  title: string;
  description: string;
}

const VIDEO_WIDTH = 800;
const VIDEO_HEIGHT = 700;
const OVAL_WIDTH = 400;
const OVAL_HEIGHT = 500;

const UniversalCapture: React.FC<Props> = ({ onCapture, onContinue, title, description }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const rafIdRef = useRef<number>(0);

  const [faceInsideOval, setFaceInsideOval] = useState(false);
  const [facingCamera, setFacingCamera] = useState(false);
  const [lightingOk, setLightingOk] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const constraintsMet = faceInsideOval && facingCamera && lightingOk;

  const isInsideOval = (x: number, y: number, cx: number, cy: number, w: number, h: number) => {
    const dx = x - cx, dy = y - cy;
    return dx * dx / (w / 2) ** 2 + dy * dy / (h / 2) ** 2 <= 1;
  };

  const avgBrightness = () => {
    const c = canvasRef.current;
    if (!c) return 0;
    const ctx = c.getContext("2d");
    if (!ctx) return 0;
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    return sum / (data.length / 4);
  };

  const processFrame = (now: number) => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const overlay = overlayRef.current!;
    const ctx = canvas.getContext("2d")!;
    const ovCtx = overlay.getContext("2d")!;

    ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -VIDEO_WIDTH, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    ctx.restore();

    const results = faceLandmarkerRef.current?.detectForVideo(video, now);

    ovCtx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    ovCtx.beginPath();
    ovCtx.ellipse(VIDEO_WIDTH / 2, VIDEO_HEIGHT / 2, OVAL_WIDTH / 2, OVAL_HEIGHT / 2, 0, 0, 2 * Math.PI);
    ovCtx.strokeStyle = "rgba(0,0,0,0.7)";
    ovCtx.lineWidth = 3;
    ovCtx.stroke();

    const multi = results?.faceLandmarks;
    if (multi && multi.length) {
      const lm = multi[0];
      const pts = [1, 10, 152, 234, 454].map(i => ({
        x: (1 - lm[i].x) * VIDEO_WIDTH,
        y: lm[i].y * VIDEO_HEIGHT,
      }));
      setFaceInsideOval(pts.every(p =>
        isInsideOval(p.x, p.y, VIDEO_WIDTH / 2, VIDEO_HEIGHT / 2, OVAL_WIDTH, OVAL_HEIGHT)
      ));
      const lDist = Math.abs(lm[33].x - lm[1].x);
      const rDist = Math.abs(lm[263].x - lm[1].x);
      setFacingCamera(Math.abs(lDist - rDist) < 0.05);
    } else {
      setFaceInsideOval(false);
      setFacingCamera(false);
    }

    setLightingOk(avgBrightness() > 70);

    rafIdRef.current = requestAnimationFrame(processFrame);
  };

  useEffect(() => {
    const init = async () => {
      try {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
          video: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT, facingMode: "user" }
        });
        if (videoRef.current && mediaStreamRef.current) {
          videoRef.current.srcObject = mediaStreamRef.current;
          await videoRef.current.play();
        }

        const visionFileset = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(visionFileset, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });

        rafIdRef.current = requestAnimationFrame(processFrame);
      } catch (e) {
        console.error("Init error:", e);
      }
    };

    init();

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      mediaStreamRef.current?.getTracks().forEach(t => t.stop());
      faceLandmarkerRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (constraintsMet && !captured && countdown === null) {
      setCountdown(3);
    }
    if (!constraintsMet && countdown !== null) {
      clearTimeout(timerRef.current!);
      setCountdown(null);
    }
    return () => clearTimeout(timerRef.current!);
  }, [constraintsMet, captured, countdown]);

  useEffect(() => {
    if (countdown === null || countdown === 0 || captured) return;

    timerRef.current = setTimeout(() => {
      setCountdown(prev => {
        if (!prev) return null;
        if (prev === 1) {
          const cropCanvas = cropCanvasRef.current!;
          const mainCanvas = canvasRef.current!;
          const cropCtx = cropCanvas.getContext("2d")!;
          cropCanvas.width = VIDEO_WIDTH;
          cropCanvas.height = VIDEO_HEIGHT;
          cropCtx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
          cropCtx.drawImage(mainCanvas, 0, 0);
          const snapshot = cropCanvas.toDataURL("image/jpeg");
          setCaptured(snapshot);
          onCapture(snapshot);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timerRef.current!);
  }, [countdown, captured, onCapture]);

  const handleRecapture = () => {
    setCaptured(null);
    setCountdown(null);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center">{title}</h2>
      <p className="text-gray-600 text-center max-w-md">{description}</p>

      <div className="relative w-full max-w-[800px] mx-auto aspect-[8/7] border border-gray-300 rounded-xl overflow-hidden bg-black">
        {captured ? (
          <img src={captured} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <>
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
              muted
              playsInline
              autoPlay
            />
            <canvas ref={canvasRef} width={VIDEO_WIDTH} height={VIDEO_HEIGHT} className="absolute top-0 left-0 w-full h-full" />
            <canvas ref={overlayRef} width={VIDEO_WIDTH} height={VIDEO_HEIGHT} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
            <canvas ref={cropCanvasRef} style={{ display: "none" }} />
          </>
        )}

        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white bg-black/50 z-10">
            {countdown}
          </div>
        )}
      </div>

      {!captured && (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <StatusDot ok={lightingOk} label="Low Lighting" />
          <StatusDot ok={faceInsideOval} label="Adjust Face" />
          <StatusDot ok={facingCamera} label="Look Straight" />
        </div>
      )}

      {!constraintsMet && !captured && (
        <div className="text-sm text-gray-500 text-center mt-2">
          Align your face inside the oval, look straight, and ensure good lighting to start auto-capture.
        </div>
      )}

      {captured && (
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <button onClick={onContinue} className="px-6 py-2 rounded-full bg-black text-white hover:bg-gray-900">
            Continue
          </button>
          <button onClick={handleRecapture} className="px-6 py-2 rounded-full bg-gray-200 text-black hover:bg-gray-300">
            Recapture
          </button>
        </div>
      )}
    </div>
  );
};

const StatusDot = ({ ok, label }: { ok: boolean; label: string }) => (
  <div className="flex items-center gap-1">
    <span className={`w-3 h-3 rounded-full ${ok ? "bg-green-600" : "bg-red-500"}`}></span>
    <span className="text-sm">{label}</span>
  </div>
);

export default UniversalCapture;
