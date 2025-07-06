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
        runtime: "tfjs", refineLandmarks: true 
      }
    );
  }
  return model;
}

/**
 * Checks image for a single face, verifies it looks forward-ish, crops it.
 */
export async function verifyAndCropFace(file: File): Promise<File> {
  const img = await createImageBitmap(file);

  const detector = await loadFaceDetector();
  const faces = await detector.estimateFaces(img);

  if (faces.length === 0) {
    throw new Error("No face detected. Please upload a clear front-facing photo.");
  }
  if (faces.length > 1) {
    throw new Error("Multiple faces detected. Please upload a photo with one face.");
  }

  const face = faces[0];
  const box = face.box;

  // Optional: check pose by landmarks
  const keypoints = face.keypoints;

  // Estimate pose: check nose and eyes horizontally
  const leftEye = keypoints.find(k => k.name === "leftEye")!;
  const rightEye = keypoints.find(k => k.name === "rightEye")!;
  const noseTip = keypoints.find(k => k.name === "noseTip")!;

  const eyeDeltaX = Math.abs(leftEye.x - rightEye.x);
  const eyeDeltaY = Math.abs(leftEye.y - rightEye.y);
  const slope = eyeDeltaY / eyeDeltaX;

  if (slope > 0.15) {
    throw new Error("Face not looking straight. Please look directly at the camera.");
  }

  // Crop to box
  const canvas = document.createElement("canvas");
  canvas.width = box.width;
  canvas.height = box.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    box.xMin,
    box.yMin,
    box.width,
    box.height,
    0,
    0,
    box.width,
    box.height
  );

  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob(b => resolve(b!), "image/jpeg")
  );

  return new File([blob], "face-cropped.jpg", { type: "image/jpeg" });
}
