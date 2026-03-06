import axiosInstance from "./axiosInstance";

// ─── REGISTER ───────────────────────────────────────────────
export const registerApi = (data) =>
    axiosInstance.post("/Auth/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email || "",
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role,
    });

export const confirmPhoneApi = (data) =>
    // data: { phoneNumber, code }
    axiosInstance.post("/Auth/confirm-phone", data);

// ─── LOGIN ───────────────────────────────────────────────────
export const loginApi = (data) =>
    axiosInstance.post("/Auth/login", {
        phoneNumber: data.phoneNumber,
        email: "",
        userName: "",
        password: data.password,
        loginType: 0,
    });

export const refreshTokenApi = (refreshToken) =>
    axiosInstance.post("/Auth/refresh-token", { refreshToken });

// ─── FORGET PASSWORD ─────────────────────────────────────────
export const forgetPasswordApi = (data) =>
    // data: { phoneNumber }
    axiosInstance.post("/Auth/forget-password", data);

export const confirmForgetPasswordTokenApi = (data) =>
    // data: { phoneNumber, code }
    axiosInstance.post("/Auth/confirm-forget-password-token", data);

export const setPasswordForForgetApi = (data) =>
    // data: { phoneNumber, newPassword, confirmPassword }
    axiosInstance.post("/Auth/set-password-for-forget-password", data);

// ─── RESET PASSWORD (login qilgan user) ──────────────────────
export const resetPasswordApi = (data) =>
    // data: { oldPassword, newPassword, confirmPassword }
    axiosInstance.post("/Auth/reset-password", data);
