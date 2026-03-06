import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import {
    loginApi,
    registerApi,
    confirmPhoneApi,
    forgetPasswordApi,
    confirmForgetPasswordTokenApi,
    setPasswordForForgetApi,
    resetPasswordApi,
} from "../api/authApi";

const useAuth = () => {
    const navigate = useNavigate();
    const { setLoading, setError, clearError, loginSuccess, logout } = useAuthStore();

    // ─── LOGIN ─────────────────────────────────────────────────
    const login = async ({ phoneNumber, password }) => {
        setLoading(true);
        clearError();
        try {
            const res = await loginApi({ phoneNumber, password });
            console.log("Login response:", res.data); // debug

            const { success, data, errorMessage } = res.data;

            if (!success) {
                setError(errorMessage || data?.message || "Login xatosi");
                return;
            }

            if (!data?.token) {
                setError(data?.message || "Token kelmadi");
                return;
            }

            loginSuccess({
                accessToken: data.token,
                refreshToken: data.refreshTokenId || "",
            });

            navigate("/dashboard");
        } catch (err) {
            console.log("Login error:", err.response?.data);
            setError(err.response?.data?.errorMessage || "Login xatosi");
        } finally {
            setLoading(false);
        }
    };

    // ─── REGISTER ──────────────────────────────────────────────
    const register = async (formData) => {
        setLoading(true);
        clearError();
        try {
            const res = await registerApi(formData);
            console.log("Register response:", res.data);

            const { success, errorMessage } = res.data;

            if (!success) {
                setError(errorMessage || "Ro'yxatdan o'tishda xato");
                return;
            }

            navigate("/confirm-phone", { state: { phoneNumber: formData.phoneNumber } });
        } catch (err) {
            console.log("Register error:", err.response?.data);
            setError(err.response?.data?.errorMessage || "Ro'yxatdan o'tishda xato");
        } finally {
            setLoading(false);
        }
    };

    // ─── CONFIRM PHONE ─────────────────────────────────────────
    const confirmPhone = async ({ phoneNumber, code }) => {
        setLoading(true);
        clearError();
        try {
            const res = await confirmPhoneApi({ phoneNumber, code });
            console.log("ConfirmPhone response:", res.data);

            const { success, errorMessage } = res.data;

            if (!success) {
                setError(errorMessage || "Kod noto'g'ri");
                return;
            }

            navigate("/login");
        } catch (err) {
            console.log("ConfirmPhone error:", err.response?.data);
            setError(err.response?.data?.errorMessage || "Kod noto'g'ri");
        } finally {
            setLoading(false);
        }
    };

    // ─── FORGET PASSWORD ───────────────────────────────────────
    const forgetPassword = async ({ phoneNumber }) => {
        setLoading(true);
        clearError();
        try {
            const res = await forgetPasswordApi({ phoneNumber });
            const { success, errorMessage } = res.data;

            if (!success) {
                setError(errorMessage || "Xato yuz berdi");
                return;
            }

            navigate("/confirm-forget-password", { state: { phoneNumber } });
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Xato yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    // ─── CONFIRM FORGET PASSWORD TOKEN ─────────────────────────
    const confirmForgetPassword = async ({ phoneNumber, code }) => {
        setLoading(true);
        clearError();
        try {
            const res = await confirmForgetPasswordTokenApi({ phoneNumber, code });
            const { success, errorMessage } = res.data;

            if (!success) {
                setError(errorMessage || "Kod noto'g'ri");
                return;
            }

            navigate("/set-new-password", { state: { phoneNumber } });
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Kod noto'g'ri");
        } finally {
            setLoading(false);
        }
    };

    // ─── SET NEW PASSWORD (forget) ─────────────────────────────
    const setNewPassword = async ({ phoneNumber, newPassword, confirmPassword }) => {
        setLoading(true);
        clearError();
        try {
            const res = await setPasswordForForgetApi({ phoneNumber, newPassword, confirmPassword });
            const { success, errorMessage } = res.data;

            if (!success) {
                setError(errorMessage || "Parol o'zgartirishda xato");
                return;
            }

            await login({ phoneNumber, password: newPassword });
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Parol o'zgartirishda xato");
        } finally {
            setLoading(false);
        }
    };

    // ─── RESET PASSWORD (login user) ───────────────────────────
    const resetPassword = async ({ oldPassword, newPassword, confirmPassword }) => {
        setLoading(true);
        clearError();
        try {
            const res = await resetPasswordApi({ oldPassword, newPassword, confirmPassword });
            const { success, errorMessage } = res.data;

            if (!success) {
                setError(errorMessage || "Parol yangilashda xato");
                return;
            }

            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Parol yangilashda xato");
        } finally {
            setLoading(false);
        }
    };

    // ─── LOGOUT ────────────────────────────────────────────────
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return {
        login,
        register,
        confirmPhone,
        forgetPassword,
        confirmForgetPassword,
        setNewPassword,
        resetPassword,
        logout: handleLogout,
    };
};

export default useAuth;