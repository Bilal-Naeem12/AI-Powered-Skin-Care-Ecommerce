import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useUserStore from "@/store/useUserStore";

const MobileScan = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [step, setStep] = useState<"capture" | "preview" | "done">("capture");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {user} = useUserStore()
  // Start camera   
  useEffect(() => {
    if (step !== "capture") return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Camera access denied or unavailable.");
        alert("Camera access denied. Please allow camera access and refresh.");
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [step]);

 const handleCapture = () => {
  if (!videoRef.current || !canvasRef.current) return;

  const video = videoRef.current;
  const canvas = canvasRef.current;

  // Set canvas size to match the video stream
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
   
  if (!ctx) return;
ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  setCaptured(canvas.toDataURL("image/jpeg"));
  setStep("preview");
};


  const handleConfirm = async () => {
    if (!captured || !sessionId) return;
    setLoading(true);

    try {
      const arr = captured.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] ?? "image/jpeg";
      const bstr = atob(arr[1]);
      const u8arr = new Uint8Array(bstr.length);
      for (let i = 0; i < bstr.length; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }
      const file = new Blob([u8arr], { type: mime });

      const formData = new FormData();
      formData.append("file", file, "mobile-upload.jpg");
formData.append("userId", user?._id ?? '');
      await axios.post(`${import.meta.env.VITE_API_BACKEND_URL}/scan-session/${sessionId}/upload`, formData);
      setStep("done");
    } catch (err: any) {
      toast.error("Upload error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render "done" message
  if (step === "done") {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl text-center">
          <h2 className="text-xl font-bold mb-2">Upload complete!</h2>
          <p className="mb-4">You can now return to your desktop to continue the analysis.</p>
        </div>
      </div>
    );
  }

  // Main capture UI
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center  justify-center z-50">
      <div className="bg-white rounded-lg p-4 shadow-xl w-[90%] flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-2">Scan Your Face</h2>
        {error && <div className="text-red-600 text-sm">{error}</div>}

        {step === "capture" && (
          <>
            <video
              ref={videoRef}
           
              autoPlay
              playsInline
                className="rounded-md border w-full "
              style={{ transform: "scaleX(-1)" }}
            />
            <canvas
              ref={canvasRef}
            className="rounded-md border "
              style={{ display: "none",transform: "scaleX(-1)"  }}
            />
            <button
              className="mt-4 bg-primary text-white text-3xl  px-4 py-2 rounded-lg"
              onClick={handleCapture}
            >
              Capture
            </button>
          </>
        )}

        {step === "preview" && captured && (
          <>
            <img
              src={captured}
              alt="Preview"
              className=" w-full object-contain rounded-md border"
            />
            <div className="flex gap-2 mt-4 w-full">
              <button
                className="flex-1 bg-gray-300 text-gray-800 py-2 text-3xl rounded-lg"
                onClick={() => setStep("capture")}
              >
                Retake
              </button>
              <button
                className="flex-1 bg-primary text-white py-2  text-3xl rounded-lg"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Confirm & Upload"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileScan;
