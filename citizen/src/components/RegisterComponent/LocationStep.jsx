import React from "react";
import { Check, Crosshair, Loader2 } from "lucide-react";

const LocationStep = ({
  formData,
  errors,
  onChange,
  onUseGPS,
  gpsLocked,
  isDetectingGPS,
  captures,
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-3xl p-6 md:p-10 min-h-[450px] animate-in fade-in slide-in-from-right-8">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl text-slate-800">
        Location Data
      </h2>

      {/* Info Banner */}
      {captures.some((c) => c.lat) && (
        <div className="flex items-start gap-3 p-4 mb-6 border bg-emerald-50 border-emerald-100 rounded-xl">
          <Check className="text-emerald-600 mt-0.5 shrink-0" size={18} />
          <p className="text-sm text-emerald-800">
            We detected coordinates from your photos. You can refine the address
            below manually.
          </p>
        </div>
      )}

      {/* Map Placeholder */}
      <div className="h-48 w-full bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-200 mb-6 flex items-center justify-center bg-[linear-gradient(#cbd5e1_1px,transparent_1px),linear-gradient(90deg,#cbd5e1_1px,transparent_1px)] bg-[size:24px_24px]">
        <button
          onClick={onUseGPS}
          className={`bg-white border px-5 py-2.5 rounded-full text-slate-700 shadow-lg flex items-center gap-2 text-sm font-bold hover:text-blue-600 transition ${
            gpsLocked ? "border-emerald-500 text-emerald-600" : ""
          }`}
        >
          {isDetectingGPS ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Crosshair size={16} />
          )}
          {gpsLocked ? "GPS Verified" : "Use Current Location"}
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        <input
          name="ward"
          value={formData.ward}
          onChange={onChange}
          placeholder="Ward No"
          className={`w-full p-4 border outline-none bg-slate-50 rounded-xl focus:border-blue-500 ${
            errors.ward ? "border-red-400" : "border-slate-200"
          }`}
        />

        <input
          name="landmark"
          value={formData.landmark}
          onChange={onChange}
          placeholder="Landmark"
          className="w-full p-4 border outline-none bg-slate-50 border-slate-200 rounded-xl focus:border-blue-500"
        />
      </div>

      <input
        name="address"
        value={formData.address}
        onChange={onChange}
        placeholder="Street Address"
        className={`w-full bg-slate-50 border rounded-xl p-4 outline-none focus:border-blue-500 ${
          errors.address ? "border-red-400" : "border-slate-200"
        }`}
      />
    </div>
  );
};

export default LocationStep;
