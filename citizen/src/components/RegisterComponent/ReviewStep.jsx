import React from "react";

const ReviewStep = ({ formData, captures }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-3xl p-6 md:p-10 min-h-[450px] animate-in fade-in slide-in-from-right-8">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl text-slate-800">
        Review Submission
      </h2>

      <div className="p-6 mb-6 border shadow-sm bg-slate-50 rounded-2xl border-slate-100">
        <div className="space-y-3">
          {/* Category */}
          <div className="flex justify-between">
            <span className="text-slate-500">Category</span>
            <span className="font-bold">{formData.category || "-"}</span>
          </div>

          {/* Location */}
          <div className="flex justify-between">
            <span className="text-slate-500">Location</span>
            <span className="font-bold text-right max-w-[220px] truncate">
              {formData.address || "-"}
            </span>
          </div>

          {/* Evidence */}
          <div className="flex justify-between pt-2 border-t border-slate-200">
            <span className="text-slate-500">Evidence</span>
            <div className="flex gap-1">
              {captures.length > 0 ? (
                captures.map((c, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] text-white font-bold ${
                      c.lat ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    title={c.lat ? "GPS attached" : "No GPS data available"}
                  >
                    {i + 1}
                  </div>
                ))
              ) : (
                <span className="text-sm text-slate-400">No photos</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
