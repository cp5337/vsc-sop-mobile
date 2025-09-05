/**
 * Camera Capture Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Advanced camera capture component with front/back camera switching and photo management
 * Implements getUserMedia API for native camera access with error handling and retry functionality
 */
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RotateCcw, Check, AlertCircle } from 'lucide-react';

const CameraCapture = ({ onCapture, onClose, mode = 'photo' }) => {
  // Camera stream state manages active video stream from device camera
  const [stream, setStream] = useState(null);
  // Captured image state stores base64 encoded image data
  const [capturedImage, setCapturedImage] = useState(null);
  // Error state handles camera access and operation errors
  const [error, setError] = useState(null);
  // Facing mode controls front ('user') or back ('environment') camera selection
  const [facingMode, setFacingMode] = useState('environment');
  // Video element reference for camera stream display
  const videoRef = useRef(null);
  // Canvas element reference for image capture and processing
  const canvasRef = useRef(null);

  // Initialize camera on component mount and cleanup on unmount or facing mode change
  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  // Start camera stream with getUserMedia API and error handling
  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied or not available');
    }
  };

  // Capture photo from video stream and convert to base64 image data
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      
      // Stop the camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  // Reset captured image and restart camera for retake functionality
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Confirm photo capture and pass image data to parent component
  const confirmCapture = () => {
    if (capturedImage && onCapture) {
      onCapture(capturedImage);
    }
    onClose();
  };

  // Switch between front and back camera by toggling facing mode
  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 p-4 flex items-center justify-between">
        <h2 className="text-white font-semibold">
          {mode === 'photo' ? 'Capture Photo' : 'Scan Document'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded-lg"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        {error ? (
          <div className="flex items-center justify-center h-full bg-gray-800">
            <div className="text-center p-6">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Camera Unavailable</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={startCamera}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : capturedImage ? (
          <div className="h-full flex items-center justify-center bg-gray-800">
            <img
              src={capturedImage}
              alt="Captured"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Camera Controls */}
        {!capturedImage && !error && (
          <div className="absolute top-4 right-4">
            <button
              onClick={switchCamera}
              className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-gray-900 p-6">
        {capturedImage ? (
          <div className="flex space-x-4">
            <button
              onClick={retakePhoto}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold"
            >
              Retake
            </button>
            <button
              onClick={confirmCapture}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center"
            >
              <Check className="w-5 h-5 mr-2" />
              Use Photo
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={capturePhoto}
              className="bg-white hover:bg-gray-200 text-black p-4 rounded-full"
            >
              <Camera className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
