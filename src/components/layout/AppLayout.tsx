import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Breadcrumbs } from "../navigation/Breadcrumbs";
import { userApi } from "../../api/userApi";
import { getToken, forceLogout } from "../../api/axiosInstance";
import { getTokenExpiryMs } from "../../utils/jwt";

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
  });

  // close the mobile menu whenever the page changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // log out automatically when the token's hour is over
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
      <Sidebar userRole={user?.role} open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between gap-3 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block text-sm font-medium text-gray-600 truncate">
              Personal Journal Workspace
            </div>
          </div>

          <div className="text-sm font-semibold text-gray-800 truncate">
            {user?.username ? (
              <>
                <span className="hidden sm:inline">Signed in as </span>
                {user.username}
                <span className="text-gray-500 font-normal"> ({user.role})</span>
              </>
            ) : (
              ""
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
};