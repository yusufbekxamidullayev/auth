import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAuthStore from "../../store/authStore";
import PhoneInput from "../../components/auth/PhoneInput";

const EyeOpen = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);
const EyeClosed = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const StepDot = ({ state }) => (
    <div className={`h-1.5 rounded-full transition-all duration-300 ${state === "active" ? "w-6 bg-blue-500" :
        state === "done" ? "w-1.5 bg-green-500" : "w-1.5 bg-[#1e2d42]"
        }`} />
);

const RegisterPage = () => {
    const { register } = useAuth();
    const { loading, error } = useAuthStore();
    const [showPass, setShowPass] = useState(false);
    const [formError, setFormError] = useState("");
    const [form, setForm] = useState({
        firstName: "", lastName: "", phoneNumber: "",
        password: "", confirmPassword: "", role: ""
    });

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError("");

        if (form.password !== form.confirmPassword) return setFormError("Parollar mos kelmadi");
        if (form.password.length < 8) return setFormError("Parol kamida 8 ta belgi bo'lishi kerak");
        if (!/[a-z]/.test(form.password)) return setFormError("Parolda kamida 1 ta kichik harf bo'lishi kerak (a-z)");
        if (!/[0-9]/.test(form.password)) return setFormError("Parolda kamida 1 ta raqam bo'lishi kerak");

        const clean = form.phoneNumber.replace(/\D/g, "");
        register({
            firstName: form.firstName,
            lastName: form.lastName,
            phoneNumber: `+${clean}`,
            password: form.password,
            confirmPassword: form.confirmPassword,
            role: form.role,
        });
    };

    const inputCls = "w-full bg-[#0d1520] border border-[#1e2d42] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all";

    return (
        <div className="min-h-screen bg-[#080c14] flex items-center justify-center px-4 py-8">
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-[440px] bg-[#111827] border border-[#1e2d42] rounded-2xl p-10 relative z-10">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-lg">💼</div>
                    <span className="text-white font-bold text-lg">UzWorks</span>
                </div>

                <div className="flex items-center gap-1.5 mb-7">
                    <StepDot state="active" /><StepDot state="none" /><StepDot state="none" />
                </div>

                <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Hisob yaratish</h1>
                <p className="text-sm text-slate-400 mb-7">Ma'lumotlaringizni to'ldiring</p>

                {(error || formError) && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-300 mb-5">
                        ⚠ {error || formError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-slate-400">Rol</label>
                        <select name="role" value={form.role} onChange={handleChange}
                            className="w-full bg-[#0d1520] border border-[#1e2d42] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                            required>
                            <option value="" disabled>Rolni tanlang</option>
                            <option value="Employee">Ishchi</option>
                            <option value="Employer">Ish beruvchi</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-slate-400">Ism</label>
                            <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
                                placeholder="Ismingiz" className={inputCls} required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-slate-400">Familiya</label>
                            <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                                placeholder="Familiyangiz" className={inputCls} required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-slate-400">Telefon raqam</label>
                        <PhoneInput value={form.phoneNumber} onChange={(val) => setForm((p) => ({ ...p, phoneNumber: val }))} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-slate-400">Parol</label>
                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Kamida 8 ta belgi, harf va raqam"
                                className={`${inputCls} pr-12`}
                                autoComplete="new-password"
                                required
                            />
                            <button type="button" onClick={() => setShowPass(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showPass ? <EyeOpen /> : <EyeClosed />}
                            </button>
                        </div>
                        <p className="text-xs text-slate-600">Kamida 8 ta belgi, 1 ta kichik harf (a-z) va 1 ta raqam</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-slate-400">Parolni tasdiqlang</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Parolni qayta kiriting"
                            className={inputCls}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 mt-1">
                        {loading ? (
                            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Yuklanmoqda...</>
                        ) : "Davom etish →"}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-400 mt-6">
                    Hisobingiz bormi?{" "}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Kirish</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
