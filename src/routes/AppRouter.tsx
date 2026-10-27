import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { JournalListPage } from "../features/journal/JournalListPage";
import { JournalDetailPage } from "../features/journal/JournalDetailPage";
import { JournalCreatePage } from "../features/journal/JournalCreatePage";
import { JournalEditPage } from "../features/journal/JournalEditPage";
import { ProfilePage } from "../features/profile/ProfilePage";
import { AdminPage } from "../features/admin/AdminPage";
import { NotFoundPage } from "../features/errors/NotFoundPage";
import { ForbiddenPage } from "../features/errors/ForbiddenPage";

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/journal" element={<JournalListPage />} />
          <Route path="/journal/new" element={<JournalCreatePage />} />
          <Route path="/journal/edit/:id" element={<JournalEditPage />} />
          <Route path="/journal/:id" element={<JournalDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />

          <Route element={<ProtectedRoute requireAdmin />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
