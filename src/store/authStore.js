import { create } from "zustand";
import { saveTokens, clearTokens, isAuthenticated, decodeToken, getAccessToken } from "../utils/tokenUtils";

const useAuthStore = create((set) => ({
    // ─── STATE ───────────────────────────────────────────────
    isAuth: isAuthenticated(),
    user: decodeToken(getAccessToken()) || null,
    loading: false,
    error: null,

    // ─── ACTIONS ─────────────────────────────────────────────
    setLoading: (val) => set({ loading: val }),
    setError: (msg) => set({ error: msg }),
    clearError: () => set({ error: null }),

    // Login muvaffaqiyatli bo'lganda
    loginSuccess: (tokens) => {
        saveTokens(tokens);
        const user = decodeToken(tokens.accessToken);
        set({ isAuth: true, user, error: null });
    },

    // Logout
    logout: () => {
        clearTokens();
        set({ isAuth: false, user: null });
    },

    // Token refresh bo'lganda
    updateAccessToken: (accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        const user = decodeToken(accessToken);
        set({ user });
    },
}));

export default useAuthStore;
