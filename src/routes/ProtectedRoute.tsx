import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getToken, clearToken } from "../api/axiosInstance";
import { isTokenExpired } from "../utils/jwt";
import { userApi } from "../api/userApi";
import { Spinner } from "../components/common/Spinner";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin }) => {
  const token = getToken();
  const valid = !!token && !isTokenExpired(token);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
    enabled: !!requireAdmin && valid,
  });

  if (!valid) {
    if (token) clearToken(); // drop an expired or legacy token
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin) {
    if (isLoading) return <Spinner />;
    if (profile?.role !== "ADMIN") return <Navigate to="/forbidden" replace />;
  }
  return <Outlet />;
};