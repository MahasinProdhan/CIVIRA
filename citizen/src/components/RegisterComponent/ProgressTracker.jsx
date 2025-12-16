import React from "react";
import { Check } from "lucide-react";

const ProgressTracker = ({ step, totalSteps }) => {
  const progressWidth = ((step - 1) / (totalSteps - 1)) * 100;

  const labels = ["Photo", "Location", "Details", "Review"];

  return (
    <div className="relative w-full max-w-4xl px-6 mx-auto mt-10 mb-12">
      <div className="relative flex justify-between px-2">
        {/* Background Line */}
        <div className="absolute top-[15px] left-0 w-full h-[3px] bg-slate-200 -z-10 rounded-full" />

        {/* Active Progress Line */}
        <div
          className="absolute top-[15px] left-0 h-[3px] bg-blue-600 shadow-md shadow-blue-600/30 transition-all duration-500 ease-out -z-10 rounded-full"
          style={{ width: `${progressWidth}%` }}
        />

        {/* Steps */}
        {Array.from({ length: totalSteps }).map((_, i) => {
          const current = i + 1;
          const isCompleted = current < step;
          const isActive = current === step;

          return (
            <div
              key={current}
              className="relative z-10 flex flex-col items-center gap-2 cursor-default"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : isActive
                      ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.15)]"
                      : "bg-white border-slate-300 text-slate-400"
                  }`}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : current}
              </div>

              <span
                className={`text-[0.7rem] uppercase font-bold tracking-wider transition-colors
                  ${isActive ? "text-blue-600" : "text-slate-400"}`}
              >
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
