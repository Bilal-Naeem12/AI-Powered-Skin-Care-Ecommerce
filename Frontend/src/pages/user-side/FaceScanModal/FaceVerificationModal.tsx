import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import * as faceapi from '@vladmandic/face-api';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface FaceVerificationModalProps {
  userId: string;
  onVerified: () => void;
  onCancel: () => void;
  onRequireCapture: () => void;
}

const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 480;

const FaceVerificationModal: React.FC<FaceVerificationModalProps> = ({
  userId,
  onVerified,
  onCancel,
  onRequireCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafIdRef = useRef<number>(0);

  const [status, setStatus] = useState<string>('Initializing...');
  const [score, setScore] = useState<number | null>(null);
  const [threshold] = useState<number>(0.3);
 const [showSuccess, setShowSuccess] = useState(false);

  const stopAll = useCallback(() => {
    console.log('[stopAll] Stopping camera and animation');
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = 0;
    }
    const video = videoRef.current;
    if (video && video.srcObject instanceof MediaStream) {
      video.srcObject.getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
  }, []);

  useEffect(() => {
    let isActive = true;
    let refDescriptor: Float32Array | null = null;

    const runVerification = async () => {
      try {
        setStatus('Loading models...');
        const modelUrl = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
        await faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl);
        await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
        await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);

        if (!isActive) return;

        setStatus('Fetching reference image...');
        const resp = await axios.get<{ secureUrl: string }>(
          `${import.meta.env.VITE_API_BACKEND_URL}/users/${userId}/face-verification`,
          { withCredentials: true }
        );
        const secureUrl = resp.data.secureUrl;
        if (!secureUrl) {
          setStatus('No reference image found. Please capture again.');
          onRequireCapture();
          return;
        }

        setStatus('Processing reference image...');
        const img = await faceapi.fetchImage(secureUrl);
        const refDetection = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (!refDetection) {
          setStatus('Unable to detect face in reference image');
          return;
        }
        refDescriptor = refDetection.descriptor;

        setStatus('Starting camera...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT, facingMode: 'user' },
        });
        if (!isActive) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setStatus('Verifying...');
        const verifyLoop = async () => {
          if (!isActive) return;
          const video = videoRef.current;
          if (video && video.readyState >= 2) {
            const liveDetection = await faceapi
              .detectSingleFace(video)
              .withFaceLandmarks()
              .withFaceDescriptor();

            if (liveDetection && refDescriptor) {
              const dist = faceapi.euclideanDistance(
                refDescriptor,
                liveDetection.descriptor
              );
              setScore(dist);
              if (dist < threshold) {
                  setStatus('Match confirmed ✅');
                stopAll();
                 setShowSuccess(true);
             
                 // after a short delay, notify parent
          await new Promise(resolve => setTimeout(resolve, 5000));
              
        
                onVerified();
              
              // show the success animation
             
                return;
              } else {
                // setStatus(`Distance: ${dist.toFixed(4)}`);
              }
            } else {
              setStatus('No face detected');
            }
          }
          rafIdRef.current = requestAnimationFrame(verifyLoop);
        };

        verifyLoop();
      } catch (err) {
        console.error('[runVerification] error:', err);
        if (isActive) setStatus('Error during verification');
      }
    };

    runVerification();
    return () => {
      isActive = false;
      stopAll();
    };
  }, [userId, onVerified, onRequireCapture, stopAll, threshold]);

  const handleCancel = () => {
    stopAll();
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl flex flex-col gap-4 items-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-2xl font-bold">Face Verification</h2>
            {showSuccess ? (
         // 2s of Lottie, then onVerified() will fire
         <DotLottieReact
           src="/assets/gif/facesuccess.json"
           autoplay={true}
           loop={false}
           style={{ width: 200, height: 200 }}
         />
       ) : 
        <div className="relative w-full max-w-lg">
          <video
            ref={videoRef}
            className="w-full rounded-xl"
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            autoPlay
            muted
            playsInline
            style={{ transform: 'scaleX(-1)' }}
          />
        </div>
        }
        <div className="text-gray-600">
          {status}

        </div>
        <button
          onClick={handleCancel}
          className="text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

export default FaceVerificationModal;
