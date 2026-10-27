import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { TOKEN_KEY } from "../api/axiosInstance";
import { userApi } from "../api/userApi";
import { Spinner } from "../components/common/Spinner";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin }) => {
  const token = localStorage.getItem(TOKEN_KEY);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: userApi.getProfile,
    enabled: !!requireAdmin && !!token,
  });

  if (!token) return <Navigate to="/login" replace />;
  if (requireAdmin) {
    if (isLoading) return <Spinner />;
    if (profile?.role !== "ADMIN") return <Navigate to="/forbidden" replace />;
  }
  return <Outlet />;
};
