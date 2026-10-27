import React from "react";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "./Sidebar";
import { Breadcrumbs } from "../navigation/Breadcrumbs";
import { userApi } from "../../api/userApi";

export const AppLayout: React.FC = () => {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: userApi.getProfile,
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={profile?.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="text-sm font-medium text-gray-600">Personal Journal Workspace</div>
          {profile && <div className="text-sm text-gray-500">Signed in as <span className="font-semibold text-gray-800">{profile.username}</span></div>}
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
