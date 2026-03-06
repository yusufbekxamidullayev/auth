import React from "react";

const PhoneInput = ({ value, onChange, error, placeholder = "+998 __ ___ __ __" }) => {
  const formatPhone = (val) => {
    const digits = val.replace(/\D/g, "");
    if (digits.startsWith("998")) {
      const local = digits.slice(3, 12);
      let formatted = "+998";
      if (local.length > 0) formatted += " " + local.slice(0, 2);
      if (local.length > 2) formatted += " " + local.slice(2, 5);
      if (local.length > 5) formatted += " " + local.slice(5, 7);
      if (local.length > 7) formatted += " " + local.slice(7, 9);
      return formatted;
    }
    return val;
  };

  const handleChange = (e) => {
    let val = e.target.value;
    if (val === "" || val === "+") { onChange(val); return; }
    if (/^\d/.test(val)) val = "998" + val;
    onChange(formatPhone(val));
  };

  return (
    <div className="flex flex-col gap-1">
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={17}
        className={`w-full bg-[#0d1520] border rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all font-mono
          ${error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
            : "border-[#1e2d42] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
          }`}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
};

export default PhoneInput;
