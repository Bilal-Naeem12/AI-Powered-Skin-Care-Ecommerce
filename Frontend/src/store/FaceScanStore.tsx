import { create } from "zustand";

// Define the types for state and actions
interface FaceScanState {
  isModalOpen: boolean;
  isLoading: boolean;
  entryOpen: boolean;
  capturedImage: string | null;
  faceRef: any | null; // The type for faceRef can be adjusted based on the actual ref object type
  detectedImage: string | null;
  detections: any[]; // You can refine the type here depending on what detections contain
  faceInsideOval: boolean;
  facingCamera: boolean;
  lightingOk: boolean;

  // Actions
  openModal: () => void;
  setEntryModal:(value:boolean)=>void;
  closeModal: () => void;
  showLoading: () => void;
  hideLoading: () => void;
  setCapturedImage: (image: string) => void;
  resetCapturedImage: () => void;
  setFaceRef: (refObj: any) => void; // Ref type is kept as `any`, you can define it more specifically
  setDetectedImage: (img: string) => void;
  setDetections: (results: any[]) => void;
  setFaceInsideOval: (value: boolean) => void;
  setFacingCamera: (value: boolean) => void;
  setLightingOk: (value: boolean) => void;
}

// Create the store with Zustand
const useFaceScanStore = create<FaceScanState>((set, get) => ({
  isModalOpen: false,
  entryOpen:false,
  isLoading: false,
  capturedImage: null,
  faceRef: null, // Holds the ref
  detectedImage: null,
  detections: [],

  faceInsideOval: false,
  facingCamera: false,
  lightingOk: false,

  // Actions
  openModal: () => set({ isModalOpen: true }),
  setEntryModal: (value) => set({ entryOpen: value }),

  closeModal: () => {
    const ref = get().faceRef;
    if (ref?.stopCamera) {
      console.log("camera closed");
      ref.stopCamera(); // Automatically stop camera on close
    }
    set({ isModalOpen: false });
  },

  showLoading: () => set({ isLoading: true }),
  hideLoading: () => set({ isLoading: false }),

  setCapturedImage: (image: string) => set({ capturedImage: image }),
  resetCapturedImage: () => set({ capturedImage: null }),

  // Set faceRef from FaceScanModal
  setFaceRef: (refObj: any) => set({ faceRef: refObj }),
  setDetectedImage: (img: string) => set({ detectedImage: img }),
  setDetections: (results: any[]) => set({ detections: results }),

  
  setFaceInsideOval: (value: boolean) => set({ faceInsideOval: value }),
  setFacingCamera: (value: boolean) => set({ facingCamera: value }),
  setLightingOk: (value: boolean) => set({ lightingOk: value }),
}));

export default useFaceScanStore;
