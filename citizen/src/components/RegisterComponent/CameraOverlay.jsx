import React from "react";
import { X, Signal } from "lucide-react";

// ---------- Helpers ----------
const getGpsSignalColor = (accuracy) => {
  if (!accuracy) return "text-slate-400";
  if (accuracy < 20) return "text-emerald-400";
  if (accuracy < 50) return "text-yellow-400";
  return "text-red-400";
};

const getGpsSignalText = (accuracy) => {
  if (!accuracy) return "Searching...";
  if (accuracy < 20) return `Excellent (${accuracy}m)`;
  if (accuracy < 50) return `Fair (${accuracy}m)`;
  return `Poor (${accuracy}m) - Wait...`;
};

// ---------- Component ----------
const CameraOverlay = ({ isOpen, videoRef, gpsStats, onClose, onCapture }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 z-20 flex items-start justify-between w-full p-4">
        {/* GPS Signal */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white border bg-black/40 backdrop-blur-md rounded-2xl border-white/10">
            <Signal
              size={16}
              className={getGpsSignalColor(gpsStats?.accuracy)}
            />
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-[10px] text-slate-400 font-bold">
                GPS Signal
              </span>
              <span>{getGpsSignalText(gpsStats?.accuracy)}</span>
            </div>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="p-2 text-white transition rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20"
        >
          <X size={24} />
        </button>
      </div>

      {/* Camera View */}
      <div className="relative flex items-center justify-center flex-1 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute object-cover w-full h-full"
        />

        {/* Guide Frame */}
        <div className="relative z-10 w-64 h-64 border-2 opacity-50 pointer-events-none border-white/50 rounded-xl">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white" />
        </div>

        {/* Helper Text */}
        <div className="absolute px-3 py-1 text-sm font-medium rounded-full bottom-10 text-white/80 bg-black/20 backdrop-blur-sm">
          {gpsStats?.accuracy && gpsStats.accuracy < 20
            ? "Target Locked. Ready to Capture."
            : "Calibrating GPS... Please wait outside."}
        </div>
      </div>

      {/* Capture Button */}
      <div className="flex items-center justify-center h-32 pb-6 bg-black/80 backdrop-blur-sm">
        <button
          onClick={onCapture}
          className={`w-20 h-20 rounded-full border-4 flex items-center justify-center group active:scale-95 transition-transform ${
            gpsStats?.accuracy > 50 ? "border-yellow-500" : "border-white"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full transition-colors ${
              gpsStats?.accuracy > 50
                ? "bg-yellow-100"
                : "bg-white group-hover:bg-slate-200"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default CameraOverlay;
