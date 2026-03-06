import React, { useRef } from "react";

const OtpInput = ({ length = 6, value, onChange, error }) => {
    const inputRefs = useRef([]);

    const handleChange = (index, e) => {
        const val = e.target.value;
        if (!/^\d*$/.test(val)) return;
        const otpArray = value.split("");
        otpArray[index] = val.slice(-1);
        const newOtp = otpArray.join("").padEnd(length, "").slice(0, length);
        onChange(newOtp);
        if (val && index < length - 1) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !value[index] && index > 0)
            inputRefs.current[index - 1]?.focus();
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        onChange(pasted.padEnd(length, "").slice(0, length));
        inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 justify-center">
                {Array.from({ length }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value[index] || ""}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className={`w-12 h-14 text-center text-xl font-bold font-mono bg-[#0d1520] border rounded-lg text-white outline-none transition-all
              ${error
                                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
                                : "border-[#1e2d42] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:scale-105"
                            }`}
                    />
                ))}
            </div>
            {error && <span className="text-xs text-red-400 text-center">{error}</span>}
        </div>
    );
};

export default OtpInput;
