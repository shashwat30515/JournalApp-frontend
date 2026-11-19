import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "./Sidebar";
import { Breadcrumbs } from "../navigation/Breadcrumbs";
import { userApi } from "../../api/userApi";
import { getToken, forceLogout } from "../../api/axiosInstance";
import { getTokenExpiryMs } from "../../utils/jwt";

export const AppLayout: React.FC = () => {
  const location = useLocation();

  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
  });

  // log out automatically when the token's hour is over
  // (re-armed on every page change, so it follows a renewed token)
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const exp = getTokenExpiryMs(token);
    if (!exp) return;

    const ms = Math.min(Math.max(exp - Date.now(), 0), 2_000_000_000);
    const id = window.setTimeout(
      () => forceLogout("Your session has expired. Please log in again."),
      ms
    );
    return () => window.clearTimeout(id);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={user?.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="text-sm font-medium text-gray-600">Personal Journal Workspace</div>
          <div className="text-sm font-semibold text-gray-800">
            {user?.username ? `Signed in as ${user.username} (${user.role})` : ""}
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
};