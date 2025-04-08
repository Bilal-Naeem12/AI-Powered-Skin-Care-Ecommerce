import { create } from "zustand";

const useFaceScanStore = create((set, get) => ({
  isModalOpen: false,
  isLoading: false,
  capturedImage: null,
  faceRef: null, // ✅ NEW: to hold the ref
  detectedImage: null,
  detections: [],

  faceInsideOval: false,
  facingCamera: false,
  lightingOk: false,
  // Actions
  openModal: () => set({ isModalOpen: true }),

  closeModal: () => {
    const ref = get().faceRef;
    if (ref?.stopCamera) {
        console.log("camera closed")
      ref.stopCamera(); // ✅ Automatically stop camera on close
    }
    set({ isModalOpen: false });
  },

  showLoading: () => set({ isLoading: true }),
  hideLoading: () => set({ isLoading: false }),

  setCapturedImage: (image) => set({ capturedImage: image }),
  resetCapturedImage: () => set({ capturedImage: null }),

  // ✅ NEW: set faceRef from FaceScanModal
  setFaceRef: (refObj) => set({ faceRef: refObj }),
  setDetectedImage: (img) => set({ detectedImage: img }),
  setDetections: (results) => set({ detections: results }),

  
  setFaceInsideOval: (value) => set({ faceInsideOval: value }),
  setFacingCamera: (value) => set({ facingCamera: value }),
  setLightingOk: (value) => set({ lightingOk: value }),
}));

export default useFaceScanStore;
