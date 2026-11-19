import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, User, Shield, LogOut, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "../../api/userApi";
import { clearToken } from "../../api/axiosInstance";

interface SidebarProps {
  userRole?: any;
  open: boolean;          // mobile drawer state
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole, open, onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // same query key as AppLayout, so this shares the cached result
  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
  });

  const role = user?.role ?? userRole;
  const isAdmin = String(role ?? "").toUpperCase().includes("ADMIN");

  const handleLogout = () => {
    clearToken();
    queryClient.clear();
    toast.success("Logged out successfully");
    onClose();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Journal Entries", to: "/journal", icon: BookOpen },
    { label: "Profile", to: "/profile", icon: User },
    ...(isAdmin ? [{ label: "Admin Panel", to: "/admin", icon: Shield }] : []),
  ];

  return (
    <>
      {/* dark overlay behind the drawer (phones only) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky md:top-0 md:h-screen md:shrink-0`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span>JournalApp</span>
          </h1>
          <button
            onClick={onClose}
            className="md:hidden p-1 text-gray-500 hover:text-gray-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/journal"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};