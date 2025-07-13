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

// These are only used to calculate the oval
const VIDEO_WIDTH = 500;
const VIDEO_HEIGHT = 400;
const OVAL_WIDTH = 250;
const OVAL_HEIGHT = 300;

const UniversalCapture: React.FC<Props> = ({
  onCapture,
  onContinue,
  title,
  description,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const rafIdRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [faceInsideOval, setFaceInsideOval] = useState(false);
  const [facingCamera, setFacingCamera] = useState(false);
  const [lightingOk, setLightingOk] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);

  const constraintsMet = faceInsideOval && facingCamera && lightingOk;

  // helper to decide "inside" the oval
  const isInsideOval = (
    x: number,
    y: number,
    cx: number,
    cy: number,
    w: number,
    h: number
  ) => {
    const dx = x - cx,
      dy = y - cy;
    return dx * dx / (w / 2) ** 2 + dy * dy / (h / 2) ** 2 <= 1;
  };

  // compute overall brightness
  const avgBrightness = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    return sum / (data.length / 4);
  };

  // main loop: draw video, detect, draw overlay, update flags, loop
  const processFrame = (now: number) => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const overlay = overlayRef.current!;
    const ctx = canvas.getContext("2d")!;
    const ovCtx = overlay.getContext("2d")!;

    // actual pixel dims
    const W = canvas.width;
    const H = canvas.height;

    // 1) draw mirrored video
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -W, 0, W, H);
    ctx.restore();

    // 2) run Mediapipe
    const res = faceLandmarkerRef.current?.detectForVideo(video, now);

    // 3) overlay mirror + clear
    ovCtx.clearRect(0, 0, W, H);
    ovCtx.save();
    ovCtx.translate(W, 0);
    ovCtx.scale(-1, 1);

    // 4) draw your oval guide (scaled relative to real size)
    const radW = (OVAL_WIDTH / VIDEO_WIDTH) * W;
    const radH = (OVAL_HEIGHT / VIDEO_HEIGHT) * H;
    ovCtx.beginPath();
    ovCtx.ellipse(W / 2, H / 2, radW / 2, radH / 2, 0, 0, 2 * Math.PI);
    ovCtx.strokeStyle = "rgba(255,255,255,0.8)";
    ovCtx.lineWidth = 3;
    ovCtx.stroke();

    // 5) draw face mesh in one Path2D
if (res?.faceLandmarks?.length) {
  const pts = res.faceLandmarks[0];
  ovCtx.fillStyle = "#FF69B4"; // Pink color
  for (let i = 0; i < pts.length; i += 1) { // every 2nd point to reduce clutter
    const { x, y } = pts[i];
    const px =  x * W; // mirror X to match mirrored video
    const py = y * H;
    ovCtx.beginPath();
    ovCtx.arc(px, py, 1.2, 0, 2 * Math.PI); // dot radius = 1.2px
    ovCtx.fill();
  }
}

    ovCtx.restore(); // unflip for next frame

    // 6) update your existing oval + pose flags
    if (res?.faceLandmarks?.length) {
      const lm = res.faceLandmarks[0];
      const checkPoints = [1, 10, 152, 234, 454].map((i) => ({
        x: lm[i].x * W,
        y: lm[i].y * H,
      }));
      setFaceInsideOval(
        checkPoints.every((p) =>
          isInsideOval(p.x, p.y, W / 2, H / 2, radW, radH)
        )
      );
      const leftDist = Math.abs(lm[33].x - lm[1].x);
      const rightDist = Math.abs(lm[263].x - lm[1].x);
      setFacingCamera(Math.abs(leftDist - rightDist) < 0.05);
    } else {
      setFaceInsideOval(false);
      setFacingCamera(false);
    }

    // 7) lighting
    setLightingOk(avgBrightness() > 70);

    // loop
    rafIdRef.current = requestAnimationFrame(processFrame);
  };

  // init camera & Mediapipe
  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      mediaStreamRef.current = stream;

      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      // now that videoWidth/videoHeight are known, sync canvas sizing
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const c = canvasRef.current!;
      const o = overlayRef.current!;
      c.width = vw;
      c.height = vh;
      o.width = vw;
      o.height = vh;

      // load Mediapipe
      const visionFileset = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );
      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
        visionFileset,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        }
      );

      // start loop
      rafIdRef.current = requestAnimationFrame(processFrame);
    })();

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      faceLandmarkerRef.current?.close();
    };
  }, []);

  // countdown start/cancel
  useEffect(() => {
    if (captured === null && constraintsMet && countdown === null) {
      setCountdown(3);
    }
    if (!constraintsMet && countdown !== null) {
      clearTimeout(timerRef.current!);
      setCountdown(null);
    }
  }, [constraintsMet, captured]);

  // countdown tick or capture
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      const dataUrl = canvasRef.current!.toDataURL("image/jpeg");
      setCaptured(dataUrl);
      onCapture(dataUrl);
      setCountdown(null);
      return;
    }
    timerRef.current = setTimeout(() => setCountdown((c) => (c ?? 0) - 1), 1000);
    return () => clearTimeout(timerRef.current!);
  }, [countdown, onCapture]);

  // recapture resets to live
  const handleRecapture = () => {
    clearTimeout(timerRef.current!);
    setCaptured(null);
    setCountdown(null);
  };

  return (
    <div className="w-full px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center mt-6">
        {title}
      </h2>
      <p className="text-gray-600 text-center max-w-md mx-auto mb-4">
        {description}
      </p>

      {/* responsive container — caps at 500px wide */}
      <div
        className="relative mx-auto border border-gray-300 rounded-xl overflow-hidden bg-black"
        style={{
          maxWidth: "500px",
          width: "90vw",
          aspectRatio: `${VIDEO_WIDTH} / ${VIDEO_HEIGHT}`,
        }}
      >
        {/* live feed */}
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
            captured ? "opacity-0" : "opacity-100"
          }`}
        />
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full transition-opacity ${
            captured ? "opacity-0" : "opacity-100"
          }`}
        />
        <canvas
          ref={overlayRef}
          className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity ${
            captured ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* snapshot */}
        {captured && (
          <img
            src={captured}
            alt="Captured"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* countdown */}
        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white bg-black/50 z-10">
            {countdown}
          </div>
        )}
      </div>

      {/* status dots */}
      {!captured && (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <StatusDot ok={lightingOk} label="Good Lighting" />
          <StatusDot ok={faceInsideOval} label="Inside Oval" />
          <StatusDot ok={facingCamera} label="Facing Camera" />
        </div>
      )}
      {!captured && !constraintsMet && (
        <p className="text-sm text-gray-500 text-center mt-2">
          Align your face inside the oval, look straight, and ensure good
          lighting to start auto-capture.
        </p>
      )}

      {/* actions */}
      {captured && (
        <div className="flex flex-col md:flex-row gap-4 mt-6 justify-center">
          <button
            onClick={onContinue}
            className="px-6 py-2 rounded-full bg-black text-white hover:bg-gray-900"
          >
            Continue
          </button>
          <button
            onClick={handleRecapture}
            className="px-6 py-2 rounded-full bg-gray-200 text-black hover:bg-gray-300"
          >
            Recapture
          </button>
        </div>
      )}
    </div>
  );
};

const StatusDot = ({ ok, label }: { ok: boolean; label: string }) => (
  <div className="flex items-center gap-2">
    <span
      className={`w-3 h-3 rounded-full ${
        ok ? "bg-green-600" : "bg-red-500"
      }`}
    ></span>
    <span className="text-sm">{label}</span>
  </div>
);

export default UniversalCapture;
