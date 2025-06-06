import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// You can use your CameraView component here or a simple HTML5 video/canvas setup.

const MobileScan: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [step, setStep] = useState<"capture" | "preview" | "done">("capture");
  const [loading, setLoading] = useState(false);

  // Start camera when mounted
React.useEffect(() => {
  if (step !== "capture") return;

  const startCamera = async () => {
    try {
      // This line requests the camera and prompts the user
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      // Show a clearer error message if blocked
      alert("Camera access denied or unavailable.\nPlease allow camera access in your browser settings and refresh the page.");
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


  // Capture photo
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, 300, 400);
    setCaptured(canvasRef.current.toDataURL("image/jpeg"));
    setStep("preview");
  };const [error, setError] = useState<string | null>(null);

  // Upload photo to FastAPI
  const handleConfirm = async () => {
    if (!captured || !sessionId) return;
    setLoading(true);
    // Convert base64 to blob
    const arr = captured.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] ?? "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    const file = new Blob([u8arr], { type: mime });
    const formData = new FormData();
    formData.append("file", file, "mobile-upload.jpg");
    try {
      await axios.post(`${import.meta.env.VITE_API_BACKEND_URL}/scan-session/${sessionId}/upload`, formData);
      setStep("done");
    } catch (err) {
      setError(err.message);
      alert("Upload failed, please try again.");
      setStep("capture");
    }
    setLoading(false);
  };

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

{error && <div className="text-red-600">{error}</div>}
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 shadow-xl w-[90%] max-w-xs flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2">Scan Your Face</h2>
        {step === "capture" && (
          <>
            <video ref={videoRef} width={300} height={400} autoPlay playsInline className="rounded-md border" />
            <canvas ref={canvasRef} width={300} height={400} style={{ display: "none" }} />
            <button
              className="mt-4 bg-primary text-white px-4 py-2 rounded-lg"
              onClick={handleCapture}
            >
              Capture
            </button>
          </>
        )}
        {step === "preview" && captured && (
          <>
            <img src={captured} alt="Preview" className="w-full h-72 object-contain rounded-md border" />
            <div className="flex gap-2 mt-4">
              <button
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg"
                onClick={() => setStep("capture")}
              >
                Retake
              </button>
              <button
                className="flex-1 bg-primary text-white py-2 rounded-lg"
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
