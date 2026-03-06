import axios from "axios";

const BASE_URL = "https://api.uzworks.uz";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor — har so'rovga accessToken qo'shish
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — 401 bo'lsa token refresh qilish
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    window.location.href = "/login";
                    return Promise.reject(error);
                }

                const response = await axios.post(`${BASE_URL}/Auth/refresh-token`, {
                    refreshToken,
                });

                // Response strukturasiga qarab token olish
                const newToken = response.data?.data?.token || response.data?.accessToken;

                if (!newToken) {
                    throw new Error("Token kelmadi");
                }

                localStorage.setItem("accessToken", newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;