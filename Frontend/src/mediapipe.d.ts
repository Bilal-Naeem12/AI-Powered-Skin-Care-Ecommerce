// src/mediapipe.d.ts

// —————— face_mesh ——————
declare module "@mediapipe/face_mesh/face_mesh.js" {
  export interface FaceMeshConfig {
    locateFile: (file: string) => string;
  }
  export interface FaceMeshOptions {
    maxNumFaces?: number;
    refineLandmarks?: boolean;
    minDetectionConfidence?: number;
    minTrackingConfidence?: number;
  }
  export interface Results {
    image: HTMLCanvasElement | HTMLVideoElement;
    multiFaceLandmarks?: Array<Array<{ x: number; y: number; z: number }>>;
  }

  export class FaceMesh {
    constructor(config: FaceMeshConfig);
    setOptions(options: FaceMeshOptions): void;
    onResults(callback: (results: Results) => void): void;
    send(input: { image: HTMLVideoElement | HTMLCanvasElement }): Promise<void>;
    close(): void;
  }
}

// ————— camera_utils ——————
declare module "@mediapipe/camera_utils/camera_utils.js" {
  import { FaceMesh } from "@mediapipe/face_mesh/face_mesh.js";
  export interface CameraConfig {
    onFrame: () => Promise<void>;
    width?: number;
    height?: number;
  }
  export class Camera {
    constructor(
      video: HTMLVideoElement,
      config: CameraConfig
    );
    start(): void;
    stop(): void;
  }
}
