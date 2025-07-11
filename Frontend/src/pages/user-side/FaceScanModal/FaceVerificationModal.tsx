import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";

interface FaceVerificationModalProps {
  userId: string;
  onVerified: () => void;
  onCancel: () => void;
}

const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 480;
const OVAL_WIDTH = 300;
const OVAL_HEIGHT = 400;

const FaceVerificationModal: React.FC<FaceVerificationModalProps> = ({
  userId,
  onVerified,
  onCancel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafIdRef = useRef<number>(0);
  const refPointsRef = useRef<any>(null);

  const [status, setStatus] = useState("Loading...");
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    let imageLandmarker: FaceLandmarker | null = null;
    let videoLandmarker: FaceLandmarker | null = null;

    const setup = async () => {
      try {
        setStatus("Loading model...");

        const vs = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        imageLandmarker = await FaceLandmarker.createFromOptions(vs, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          runningMode: "IMAGE",
          numFaces: 1,
        });

        videoLandmarker = await FaceLandmarker.createFromOptions(vs, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });

        setStatus("Fetching reference...");

        const resp = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/users/${userId}/face-verification`,
          { credentials: "include" }
        );
        const { secureUrl } = await resp.json();

        const refImg = new Image();
        refImg.crossOrigin = "anonymous";
        refImg.src = secureUrl;
        await new Promise((r) => (refImg.onload = r));

        const refResults = imageLandmarker.detect(refImg);
        if (!refResults.faceLandmarks?.length) {
          setStatus("No face in reference image");
          return;
        }
        refPointsRef.current = refResults.faceLandmarks[0];
        setStatus("Starting camera...");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT, facingMode: "user" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setStatus("Detecting...");

        const loop = (now: number) => {
          const video = videoRef.current!;
          const canvas = canvasRef.current!;
          const ctx = canvas.getContext("2d")!;

          ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
          ctx.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

          // Oval
          ctx.beginPath();
          ctx.ellipse(
            VIDEO_WIDTH / 2,
            VIDEO_HEIGHT / 2,
            OVAL_WIDTH / 2,
            OVAL_HEIGHT / 2,
            0,
            0,
            2 * Math.PI
          );
          ctx.strokeStyle = "rgba(0,0,0,0.7)";
          ctx.lineWidth = 3;
          ctx.stroke();

          const results = videoLandmarker!.detectForVideo(video, now);

          if (results.faceLandmarks?.length && refPointsRef.current) {
            const livePoints = results.faceLandmarks[0];
            const refPoints = refPointsRef.current;

            let sumDist = 0;
            for (let i = 0; i < Math.min(refPoints.length, livePoints.length); i++) {
              const dx = refPoints[i].x - livePoints[i].x;
              const dy = refPoints[i].y - livePoints[i].y;
              const dz = refPoints[i].z - livePoints[i].z;
              sumDist += Math.sqrt(dx * dx + dy * dy + dz * dz);
            }
            const avgDist = sumDist / refPoints.length;
            setScore(avgDist);

            if (avgDist < 0.03) {
              setStatus("Match confirmed ✅");
              console.log("match with" + avgDist)
              onVerified();
              return;
            } else {
              setStatus("Detecting...");
            }
          }

          rafIdRef.current = requestAnimationFrame(loop);
        };

        rafIdRef.current = requestAnimationFrame(loop);
      } catch (err) {
        console.error(err);
        setStatus("Error occurred");
      }
    };

    setup();

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      imageLandmarker?.close();
      videoLandmarker?.close();
      const tracks = videoRef.current?.srcObject as MediaStream;
      tracks?.getTracks().forEach((t) => t.stop());
    };
  }, [userId, onVerified]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl flex flex-col gap-4 items-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-2xl font-bold">Face Verification</h2>
        <div className="relative w-full max-w-lg">
          <video
            ref={videoRef}
            className="w-full rounded-xl"
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            autoPlay
            muted
            playsInline
            style={{ transform: "scaleX(-1)" }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
          />
        </div>

        <div className="text-gray-600">
          {status} {score !== null && `(Distance: ${score.toFixed(5)})`}
        </div>

        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

export default FaceVerificationModal;
