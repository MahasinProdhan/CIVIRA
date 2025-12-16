import React, { useEffect, useRef, useState } from "react";

import ProgressTracker from "../components/RegisterComponent/ProgressTracker";
import CameraOverlay from "../components/RegisterComponent/CameraOverlay";
import CaptureStep from "../components/RegisterComponent/CaptureStep";
import LocationStep from "../components/RegisterComponent/LocationStep";
import DetailsStep from "../components/RegisterComponent/DetailsStep";
import ReviewStep from "../components/RegisterComponent/ReviewStep";
import SuccessModal from "../components/RegisterComponent/SuccessModal";

// ---------- Helper ----------
const dataURLtoBlob = (dataurl) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
};

const TOTAL_STEPS = 4;

const RegisterComplaints = () => {
  // ---------------- Core State ----------------
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    ward: "",
    landmark: "",
    address: "",
    category: "",
    description: "",
    notes: "",
  });

  const [captures, setCaptures] = useState([]);
  const [errors, setErrors] = useState({});

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ---------------- Camera + GPS refs ----------------
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const locationRef = useRef({
    lat: null,
    lng: null,
    accuracy: null,
    error: null,
  });

  const watchIdRef = useRef(null);

  const [currentGpsStats, setCurrentGpsStats] = useState({
    lat: null,
    lng: null,
    accuracy: null,
  });

  // ---------------- Input Handler ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // ---------------- GPS Tracking (Camera) ----------------
  const startLocationTracking = () => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        locationRef.current = {
          lat: latitude,
          lng: longitude,
          accuracy,
          error: null,
        };

        setCurrentGpsStats({
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
        });
      },
      (err) => {
        locationRef.current = {
          lat: null,
          lng: null,
          accuracy: null,
          error: err.message,
        };
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );
  };

  const stopLocationTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // ---------------- Camera ----------------
  const startCamera = async () => {
    if (captures.length >= 3) {
      alert("Maximum 3 photos allowed");
      return;
    }

    setIsCameraOpen(true);
    startLocationTracking();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Unable to access camera");
      stopLocationTracking();
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    stopLocationTracking();
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    const { lat, lng, accuracy, error } = locationRef.current;

    setCaptures((prev) => [
      ...prev,
      {
        id: Date.now(),
        previewUrl: dataUrl,
        blob: dataURLtoBlob(dataUrl),
        lat,
        lng,
        accuracy,
        gpsError: error,
      },
    ]);

    stopCamera();
  };

  const removePhoto = (id) => {
    setCaptures((prev) => prev.filter((c) => c.id !== id));
  };

  // ---------------- Manual GPS Button ----------------
  const handleGPS = () => {
    setIsDetectingGPS(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setFormData((prev) => ({
          ...prev,
          address: `Detected at ${latitude.toFixed(4)}, ${longitude.toFixed(
            4
          )}`,
          ward: prev.ward || "Ward 12",
          landmark: prev.landmark || "Near Main Road",
        }));

        setGpsLocked(true);
        setIsDetectingGPS(false);
      },
      () => {
        setIsDetectingGPS(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // ---------------- AUTO GPS when Step 2 opens ----------------
  useEffect(() => {
    if (step !== 2) return;
    if (gpsLocked) return;
    if (!navigator.geolocation) return;

    setIsDetectingGPS(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setFormData((prev) => ({
          ...prev,
          address: `Detected at ${latitude.toFixed(4)}, ${longitude.toFixed(
            4
          )}`,
          ward: prev.ward || "Ward 12",
          landmark: prev.landmark || "Near Main Road",
        }));

        setGpsLocked(true);
        setIsDetectingGPS(false);
      },
      () => {
        setIsDetectingGPS(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, [step, gpsLocked]);

  // ---------------- Validation ----------------
  const validateStep = () => {
    const e = {};

    if (step === 2) {
      if (!formData.ward) e.ward = true;
      if (!formData.address) e.address = true;
    }

    if (step === 3) {
      if (!formData.category) e.category = true;
      if (!formData.description) e.description = true;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---------------- Navigation ----------------
  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      if (validateStep()) setStep((prev) => prev + 1);
    } else {
      submitToBackend();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  // ---------------- Submit ----------------
  const submitToBackend = async () => {
    setIsSubmitting(true);

    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));

    captures.forEach((c, i) => {
      fd.append(`evidence_${i + 1}`, c.blob, `photo_${i + 1}.jpg`);
      fd.append(`evidence_${i + 1}_lat`, c.lat || "");
      fd.append(`evidence_${i + 1}_lng`, c.lng || "");
      fd.append(`evidence_${i + 1}_accuracy`, c.accuracy || "");
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  // ---------------- Cleanup ----------------
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-slate-50">
      <ProgressTracker step={step} totalSteps={TOTAL_STEPS} />

      <CameraOverlay
        isOpen={isCameraOpen}
        videoRef={videoRef}
        gpsStats={currentGpsStats}
        onClose={stopCamera}
        onCapture={capturePhoto}
      />

      {step === 1 && (
        <CaptureStep
          captures={captures}
          onOpenCamera={startCamera}
          onRemovePhoto={removePhoto}
        />
      )}

      {step === 2 && (
        <LocationStep
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onUseGPS={handleGPS}
          gpsLocked={gpsLocked}
          isDetectingGPS={isDetectingGPS}
          captures={captures}
        />
      )}

      {step === 3 && (
        <DetailsStep
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
        />
      )}

      {step === 4 && <ReviewStep formData={formData} captures={captures} />}

      {/* Navigation */}
      <div className="flex justify-between max-w-4xl px-6 py-8 mx-auto">
        <button onClick={handleBack} disabled={step === 1 || isSubmitting}>
          Back
        </button>
        <button onClick={handleNext} disabled={isSubmitting}>
          {step === TOTAL_STEPS ? "Submit" : "Next"}
        </button>
      </div>

      <SuccessModal isOpen={isSuccess} />
    </div>
  );
};

export default RegisterComplaints;
