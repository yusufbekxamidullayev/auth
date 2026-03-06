import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute, { PublicRoute } from "../components/auth/ProtectedRoute";

// Auth pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ConfirmPhonePage from "../pages/auth/ConfirmPhonePage";
import ForgetPasswordPage from "../pages/auth/ForgetPasswordPage";
import ConfirmForgetPage from "../pages/auth/ConfirmForgetPage";
import SetNewPasswordPage from "../pages/auth/SetNewPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

// Vaqtincha Dashboard
const Dashboard = () => (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center flex-col gap-4">
        <div className="text-5xl">🎉</div>
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-400 text-sm">Muvaffaqiyatli kirdingiz!</p>
    </div>
);

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* ─── PUBLIC ROUTES (faqat login bo'lmagan user) ─── */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/confirm-phone" element={<ConfirmPhonePage />} />
                    <Route path="/forget-password" element={<ForgetPasswordPage />} />
                    <Route path="/confirm-forget-password" element={<ConfirmForgetPage />} />
                    <Route path="/set-new-password" element={<SetNewPasswordPage />} />
                </Route>

                {/* ─── PROTECTED ROUTES (faqat login bo'lgan user) ─── */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
