export const saveTokens = ({ accessToken, refreshToken }) => {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

export const getAccessToken = () => localStorage.getItem("accessToken");

export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const isAuthenticated = () => !!localStorage.getItem("accessToken");

export const decodeToken = (token) => {
    try {
        const base64Payload = token.split(".")[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch {
        return null;
    }
};

export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded?.exp) return true;
    return decoded.exp * 1000 < Date.now();
};