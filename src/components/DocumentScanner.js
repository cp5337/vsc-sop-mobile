/**
 * Document Scanner Component
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Advanced document scanning component with type classification and storage management
 * Implements camera capture, document type selection, and localStorage persistence
 */
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RotateCcw, Check, AlertCircle, FileText, Download, Trash2 } from 'lucide-react';

const DocumentScanner = ({ onScan, onClose }) => {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [documentType, setDocumentType] = useState('id');
  const [scannedDocuments, setScannedDocuments] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const documentTypes = [
    { id: 'id', label: 'ID Card', icon: '🆔' },
    { id: 'credential', label: 'Credential', icon: '🎫' },
    { id: 'license', label: 'License', icon: '📄' },
    { id: 'permit', label: 'Permit', icon: '📋' },
    { id: 'other', label: 'Other', icon: '📄' }
  ];

  useEffect(() => {
    startCamera();
    loadScannedDocuments();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
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

  const captureDocument = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageData);
      
      // Stop the camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const saveDocument = () => {
    if (capturedImage) {
      const document = {
        id: Date.now(),
        type: documentType,
        image: capturedImage,
        timestamp: new Date().toISOString(),
        typeLabel: documentTypes.find(dt => dt.id === documentType)?.label || 'Document'
      };
      
      const updatedDocuments = [...scannedDocuments, document];
      setScannedDocuments(updatedDocuments);
      localStorage.setItem('scannedDocuments', JSON.stringify(updatedDocuments));
      
      if (onScan) {
        onScan(document);
      }
      
      setCapturedImage(null);
      startCamera();
    }
  };

  const loadScannedDocuments = () => {
    const saved = localStorage.getItem('scannedDocuments');
    if (saved) {
      setScannedDocuments(JSON.parse(saved));
    }
  };

  const deleteDocument = (documentId) => {
    const updated = scannedDocuments.filter(doc => doc.id !== documentId);
    setScannedDocuments(updated);
    localStorage.setItem('scannedDocuments', JSON.stringify(updated));
  };

  const downloadDocument = (document) => {
    const link = document.createElement('a');
    link.download = `document-${document.type}-${document.id}.jpg`;
    link.href = document.image;
    link.click();
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-600">
        <h2 className="text-white font-semibold flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Document Scanner
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded-lg"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Document Type Selector */}
      <div className="bg-gray-800 p-4 border-b border-gray-600">
        <div className="flex space-x-2 overflow-x-auto">
          {documentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setDocumentType(type.id)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                documentType === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
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
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured Document"
                className="max-w-full max-h-full object-contain"
              />
              {/* Document overlay */}
              <div className="absolute inset-0 border-2 border-blue-400 rounded-lg pointer-events-none">
                <div className="absolute top-2 left-2 bg-blue-400 text-white px-2 py-1 rounded text-xs">
                  {documentTypes.find(dt => dt.id === documentType)?.label}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Document frame overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-48 border-2 border-blue-400 rounded-lg relative">
                <div className="absolute top-2 left-2 bg-blue-400 text-white px-2 py-1 rounded text-xs">
                  {documentTypes.find(dt => dt.id === documentType)?.label}
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                  Position document within frame
                </div>
              </div>
            </div>
            
            {/* Camera controls */}
            <div className="absolute top-4 right-4">
              <button
                onClick={switchCamera}
                className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-gray-800 p-6 border-t border-gray-600">
        {capturedImage ? (
          <div className="flex space-x-3">
            <button
              onClick={retakePhoto}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold"
            >
              Retake
            </button>
            <button
              onClick={saveDocument}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center"
            >
              <Check className="w-5 h-5 mr-2" />
              Save Document
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={captureDocument}
              className="bg-white hover:bg-gray-200 text-black p-4 rounded-full"
            >
              <Camera className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>

      {/* Scanned Documents List */}
      {scannedDocuments.length > 0 && (
        <div className="bg-gray-800 border-t border-gray-600 max-h-40 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-white font-semibold mb-3">Recent Scans</h3>
            <div className="grid grid-cols-2 gap-2">
              {scannedDocuments.slice(-4).map((doc) => (
                <div key={doc.id} className="relative group">
                  <img
                    src={doc.image}
                    alt={doc.typeLabel}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                    <button
                      onClick={() => downloadDocument(doc)}
                      className="p-1 bg-blue-600 hover:bg-blue-700 rounded"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-1 bg-red-600 hover:bg-red-700 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                    {doc.typeLabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default DocumentScanner;
