import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAuthStore from "../../store/authStore";

const OtpInput = ({ value, onChange }) => {
    const inputRefs = React.useRef([]);
    const length = 6;

    const handleChange = (index, e) => {
        const val = e.target.value;
        if (!/^\d*$/.test(val)) return;
        const arr = value.split("");
        arr[index] = val.slice(-1);
        const newOtp = arr.join("").padEnd(length, "").slice(0, length);
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
                    className="w-12 h-14 text-center text-xl font-bold font-mono bg-[#0d1520] border border-[#1e2d42] rounded-lg text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:scale-105"
                />
            ))}
        </div>
    );
};

const ConfirmPhonePage = () => {
    const { confirmPhone } = useAuth();
    const { loading, error } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const phoneNumber = location.state?.phoneNumber || "";
    const [otp, setOtp] = useState("");
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true);
            return;
        }
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (otp.length < 6) return;
        confirmPhone({ phoneNumber, code: otp });
    };

    const handleResend = () => {
        if (!canResend) return;
        setCountdown(60);
        setCanResend(false);
        setOtp("");
        // Qayta SMS yuborish uchun register ga qaytish
        navigate("/register");
    };

    // Telefon raqamni formatlash
    const maskedPhone = phoneNumber
        ? phoneNumber.slice(0, 7) + "*** **" + phoneNumber.slice(-2)
        : "";

    return (
        <div className="min-h-screen bg-[#080c14] flex items-center justify-center px-4">
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-[420px] bg-[#111827] border border-[#1e2d42] rounded-2xl p-10 relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-lg">💼</div>
                    <span className="text-white font-bold text-lg">UzWorks</span>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-1.5 mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <div className="w-6 h-1.5 rounded-full bg-blue-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1e2d42]" />
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6">
                    📱
                </div>

                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    Telefon tasdiqlash
                </h1>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    <span className="text-white font-mono">{maskedPhone}</span> raqamiga
                    6 xonali SMS kod yuborildi
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-300 mb-5">
                        ⚠ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <label className="text-xs font-medium text-slate-400 text-center">
                            SMS kodni kiriting
                        </label>
                        <OtpInput value={otp} onChange={setOtp} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Tekshirilmoqda...</>
                        ) : "Tasdiqlash"}
                    </button>
                </form>

                {/* Resend */}
                <div className="mt-6 text-center">
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Kodni qayta yuborish
                        </button>
                    ) : (
                        <p className="text-sm text-slate-500">
                            Kodni qayta yuborish{" "}
                            <span className="text-slate-300 font-mono">{countdown}s</span> dan keyin
                        </p>
                    )}
                </div>

                <p className="text-center text-sm text-slate-400 mt-4">
                    <button
                        onClick={() => navigate("/register")}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        ← Orqaga qaytish
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ConfirmPhonePage;