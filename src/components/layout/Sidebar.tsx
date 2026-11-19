import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, User, Shield, LogOut } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "../../api/userApi";

interface SidebarProps {
  userRole?: any;
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Same query key as AppLayout, so this shares the cached result (no extra request)
  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
  });

  const role = user?.role ?? userRole;
  const isAdmin = String(role ?? "").toUpperCase().includes("ADMIN");

  console.log("Sidebar role:", role, "isAdmin:", isAdmin);

  const handleLogout = () => {
    localStorage.removeItem("journal_auth_token");
    queryClient.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Journal Entries", to: "/journal", icon: BookOpen },
    { label: "Profile", to: "/profile", icon: User },
    ...(isAdmin ? [{ label: "Admin Panel", to: "/admin", icon: Shield }] : []),
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <span>JournalApp</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
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
  );
};