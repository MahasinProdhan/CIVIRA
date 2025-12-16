import React from "react";
import { Camera, X, MapPin, AlertTriangle } from "lucide-react";

const CaptureStep = ({ captures, onOpenCamera, onRemovePhoto }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-3xl p-6 md:p-10 min-h-[450px] animate-in fade-in slide-in-from-right-8">
      <h2 className="mb-2 text-2xl font-bold md:text-3xl text-slate-800">
        Capture Evidence
      </h2>
      <p className="mb-8 text-slate-500">
        Click clear photos. Location will be auto-tagged.
      </p>

      {/* Add Photo */}
      <div
        onClick={onOpenCamera}
        className="group border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 active:scale-[0.99]"
      >
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-transform duration-300 bg-white rounded-full shadow-sm group-hover:scale-110">
          <Camera
            className="transition-colors text-slate-400 group-hover:text-blue-600"
            size={28}
          />
        </div>
        <h3 className="mb-1 text-lg font-bold text-slate-900">
          Tap to Take Photo
        </h3>
        <p className="text-sm text-slate-500">Auto-tags GPS Location</p>
      </div>

      {/* Captured Images */}
      {captures.length > 0 && (
        <div className="flex flex-col gap-3 mt-8 animate-in fade-in zoom-in-95">
          <h4 className="mb-2 text-sm font-bold tracking-wider uppercase text-slate-400">
            Attached Evidence
          </h4>

          {captures.map((cap, idx) => (
            <div
              key={cap.id}
              className="relative flex items-center gap-4 p-3 overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 overflow-hidden rounded-lg shrink-0 bg-slate-100">
                <img
                  src={cap.previewUrl}
                  alt={`Capture ${idx + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-700">
                    Image {idx + 1}
                  </span>
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                    {(cap.blob.size / 1024).toFixed(0)} KB
                  </span>
                </div>

                {/* GPS Status */}
                {cap.lat ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <MapPin size={12} fill="currentColor" />
                    <span>
                      {cap.lat.toFixed(6)}, {cap.lng.toFixed(6)}
                    </span>
                    <span className="text-slate-400 text-[10px] ml-1">
                      (±{Math.round(cap.accuracy)}m)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                    <AlertTriangle size={12} />
                    <span>{cap.gpsError || "No Location Data"}</span>
                  </div>
                )}
              </div>

              {/* Remove */}
              <button
                onClick={() => onRemovePhoto(cap.id)}
                className="p-2 transition-colors rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          {/* Add More */}
          {captures.length < 3 && (
            <button
              onClick={onOpenCamera}
              className="flex items-center justify-center w-full gap-2 py-3 text-sm font-medium transition-all border border-dashed rounded-xl border-slate-300 text-slate-500 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600"
            >
              <Camera size={16} /> Add another photo
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CaptureStep;
