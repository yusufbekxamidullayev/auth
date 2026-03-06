import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const ProtectedRoute = () => {
    const isAuth = useAuthStore((state) => state.isAuth);
    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export const PublicRoute = () => {
    const isAuth = useAuthStore((state) => state.isAuth);
    return !isAuth ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default ProtectedRoute;