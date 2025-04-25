import React, { useEffect } from "react";
import FaceScanner from "@/component/UI/FaceScanner";
import useFaceScanStore from "@/store/useFaceScanStore";

/* -------- props ----------------------------------------------------------- */
interface Props {
  viewState: "countdown" | "result" | "loading" | "capture";
  countdown: number;
  startCountdown: () => void;
  abortCountdown: () => void;
  faceRef: React.RefObject<any>;
  capturedImage: string | null;
}

/* -------------------------------------------------------------------------- */
const CameraView: React.FC<Props> = ({
  viewState,
  countdown,
  startCountdown,
  abortCountdown,
  faceRef,
  capturedImage,
}) => {
  /* constraint flags from Zustand */
  const { faceInsideOval, facingCamera, lightingOk } =
    useFaceScanStore.getState();

  const constraintsMet = faceInsideOval && facingCamera && lightingOk;

  /* ---------- auto-start / auto-abort logic ------------------------------- */
  useEffect(() => {
    if (constraintsMet && viewState === "capture") startCountdown();
    if (!constraintsMet && viewState === "countdown") abortCountdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [constraintsMet, viewState]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        className={`relative border border-gray-300 rounded-lg w-[300px] h-[400px] bg-gray-100 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
          viewState === "countdown" ? "opacity-50" : "opacity-100"
        }`}
      >
        {/* ---- show camera or captured img ---------------------------------- */}
        {viewState === "result" && capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="object-cover w-full h-full rounded-lg"
          />
        ) : (
          <FaceScanner ref={faceRef} />
        )}

        {/* ---- countdown overlay ------------------------------------------- */}
        {viewState === "countdown" && (
          <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-black z-10">
            {countdown}
          </div>
        )}

        {/* ---- loading spinner --------------------------------------------- */}
        {viewState === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="loader border-t-2 border-black rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}
      </div>

      {/* ---- helper hint when constraints not met -------------------------- */}
      {viewState === "capture" && !constraintsMet && (
        <p className="mt-4 text-sm text-gray-500 text-center max-w-xs">
          Align your face inside the oval, face the camera directly, and ensure
          good lighting to start.
        </p>
      )}
    </div>
  );
};

export default CameraView;
