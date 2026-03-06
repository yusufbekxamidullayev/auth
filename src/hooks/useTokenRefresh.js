import { useEffect } from "react";
import { refreshTokenApi } from "../api/authApi";
import useAuthStore from "../store/authStore";
import { getRefreshToken } from "../utils/tokenUtils";

// Har 15 minutda token refresh qiluvchi hook
const useTokenRefresh = () => {
    const { isAuth, updateAccessToken, logout } = useAuthStore();

    useEffect(() => {
        if (!isAuth) return;

        const refresh = async () => {
            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) return;

                const res = await refreshTokenApi(refreshToken);
                updateAccessToken(res.data.accessToken);
            } catch {
                // Refresh token ham eskirgan — logout
                logout();
            }
        };

        // 14 minut 50 soniyada refresh (15 minutdan biroz oldin)
        const INTERVAL = 14 * 60 * 1000 + 50 * 1000;
        const timer = setInterval(refresh, INTERVAL);

        return () => clearInterval(timer);
    }, [isAuth]);
};

export default useTokenRefresh;
