import React from "react";

const DetailsStep = ({ formData, errors, onChange }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-3xl p-6 md:p-10 min-h-[450px] animate-in fade-in slide-in-from-right-8">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl text-slate-800">
        Issue Specifics
      </h2>

      <div className="flex flex-col gap-6">
        {/* Category */}
        <select
          name="category"
          value={formData.category}
          onChange={onChange}
          className={`w-full h-[60px] bg-slate-50 border rounded-xl px-4 outline-none focus:border-blue-500 ${
            errors.category ? "border-red-400" : "border-slate-200"
          }`}
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="Sanitation">Sanitation</option>
          <option value="Roads">Roads</option>
          <option value="Street Light">Street Light</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Garbage">Garbage</option>
        </select>

        {/* Short Description */}
        <input
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Short Description"
          className={`w-full bg-slate-50 border rounded-xl p-4 h-[60px] outline-none focus:border-blue-500 ${
            errors.description ? "border-red-400" : "border-slate-200"
          }`}
        />

        {/* Additional Notes */}
        <textarea
          name="notes"
          value={formData.notes}
          onChange={onChange}
          placeholder="Additional Notes (optional)"
          className="w-full h-32 p-4 border outline-none resize-none bg-slate-50 border-slate-200 rounded-xl focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default DetailsStep;
