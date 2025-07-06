import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-backend-webgl";

/**
 * Loads the face detection model if not already loaded.
 */
let model: faceLandmarksDetection.FaceLandmarksDetector | null = null;

export async function loadFaceDetector() {
  if (!model) {
    await tf.setBackend("webgl");
    await tf.ready();
    model = await faceLandmarksDetection.createDetector(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
      {
        runtime: "tfjs",
        refineLandmarks: true,
      }
    );
  }
  return model;
}

/**
 * Checks image for a single face, verifies pose, crops with padding.
 * @param file The uploaded image file
 * @param paddingFactor 0.0 to 1.0 (0% to 100% padding around face box)
 */
export async function verifyAndCropFace(
  file: File,
  paddingFactor: number = 0.4 // default: 30% padding
): Promise<File> {
  const img = await createImageBitmap(file);

  const detector = await loadFaceDetector();
  const faces = await detector.estimateFaces(img);

  if (faces.length === 0) {
    throw new Error("❌ No face detected. Please upload a clear front-facing photo.");
  }
  if (faces.length > 1) {
    throw new Error("❌ Multiple faces detected. Please upload a photo with one face.");
  }

  const face = faces[0];
  const box = face.box;

  // Optional: pose check
  const keypoints = face.keypoints;
  const leftEye = keypoints.find(k => k.name === "leftEye");
  const rightEye = keypoints.find(k => k.name === "rightEye");

  if (leftEye && rightEye) {
    const eyeDeltaX = Math.abs(leftEye.x - rightEye.x);
    const eyeDeltaY = Math.abs(leftEye.y - rightEye.y);
    const slope = eyeDeltaY / eyeDeltaX;
    if (slope > 0.15) {
      throw new Error("❌ Face not looking straight. Please face the camera directly.");
    }
  }

  // ✅ Add adjustable padding
  const padX = box.width * paddingFactor;
  const padY = box.height * paddingFactor;

  const cropX = Math.max(0, box.xMin - padX);
  const cropY = Math.max(0, box.yMin - padY);
  const cropWidth = Math.min(img.width - cropX, box.width + padX * 2);
  const cropHeight = Math.min(img.height - cropY, box.height + padY * 2);

  // Canvas to crop
  const canvas = document.createElement("canvas");
  canvas.width = cropWidth;
  canvas.height = cropHeight;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob(b => resolve(b!), "image/jpeg")
  );

  return new File([blob], "face-cropped.jpg", { type: "image/jpeg" });
}
