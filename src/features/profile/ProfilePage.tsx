import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";
import { userApi } from "../../api/userApi";
import { authApi } from "../../api/authApi";
import {
  setToken,
  clearToken,
  getLoginMethod,
  setLoginMethod,
} from "../../api/axiosInstance";
import { Spinner } from "../../components/common/Spinner";

const schema = z
  .object({
    currentUsername: z.string().optional(),
    currentPassword: z.string().optional(),
    username: z.string().min(3, "At least 3 characters"),
    email: z
      .string()
      .optional()
      .refine((v) => !v || /^\S+@\S+\.\S+$/.test(v), "Enter a valid email"),
    newPassword: z
      .string()
      .optional()
      .refine((v) => !v || v.length >= 6, "At least 6 characters"),
    confirmPassword: z.string().optional(),
  })
  .refine((d) => !d.newPassword || d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const inputCls =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none";

// ---------- delete confirmation pop-up ----------
const DeleteAccountModal: React.FC<{
  username: string;
  isGoogle: boolean;
  onClose: () => void;
}> = ({ username, isGoogle, onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (isGoogle) {
        // Google accounts confirm by typing the username
        if (value.trim() !== username) throw new Error("The username does not match.");
      } else {
        if (!value) throw new Error("Enter your password.");
        const ok = await authApi.checkCredentials(username, value);
        if (!ok) throw new Error("Incorrect password.");
      }
      await userApi.deleteAccount();
    },
    onSuccess: () => {
      clearToken();
      queryClient.clear();
      toast.success("Account deleted");
      navigate("/login");
    },
    onError: (e: any) => {
      if (!e?.response && !e?.request) toast.error(e?.message || "Could not delete account");
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-sm p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-red-600">Delete account</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          This permanently deletes <span className="font-medium">{username}</span> and all journal
          entries.{" "}
          {isGoogle
            ? "Type your username below to confirm."
            : "Enter your password to confirm."}
        </p>

        <input
          type={isGoogle ? "text" : "password"}
          autoFocus
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && deleteMutation.mutate()}
          placeholder={isGoogle ? username : "Current password"}
          className={inputCls}
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending || !value}
            className="px-5 py-2 text-sm bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete my account"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- page ----------
export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDelete, setShowDelete] = useState(false);
  const isGoogle = getLoginMethod() === "google";

  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      currentUsername: "",
      currentPassword: "",
      username: profile?.username ?? "",
      email: profile?.email ?? "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (d: FormData): Promise<{ needsLogin: boolean }> => {
      // ---------- Google account: no password check ----------
      if (isGoogle) {
        const payload: { username: string; password?: string; email?: string } = {
          username: profile?.username ?? d.username, // username stays the same
        };
        if (d.email && d.email.trim()) payload.email = d.email.trim();
        if (d.newPassword) payload.password = d.newPassword;
        await userApi.updateProfile(payload);
        return { needsLogin: false }; // same username, so the token is still valid
      }

      // ---------- normal account: verify old credentials ----------
      if (!d.currentUsername || !d.currentPassword) {
        throw new Error("Enter your current username and password.");
      }
      if (profile?.username && d.currentUsername !== profile.username) {
        throw new Error("Current username does not match your account.");
      }
      const ok = await authApi.checkCredentials(d.currentUsername, d.currentPassword);
      if (!ok) throw new Error("Current username or password is incorrect.");

      const finalPassword = d.newPassword || d.currentPassword;
      const payload: { username: string; password: string; email?: string } = {
        username: d.username,
        password: finalPassword,
      };
      if (d.email && d.email.trim()) payload.email = d.email.trim();
      await userApi.updateProfile(payload);

      // the old token names the old username, so get a fresh one
      const fresh = await authApi.checkCredentials(d.username, finalPassword);
      if (fresh) {
        setToken(fresh);
        setLoginMethod("password");
        return { needsLogin: false };
      }
      clearToken();
      return { needsLogin: true };
    },
    onSuccess: (res) => {
      if (res.needsLogin) {
        toast.success("Profile updated. Please log in again.");
        queryClient.clear();
        navigate("/login");
        return;
      }
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      reset();
    },
    onError: (e: any) => {
      if (!e?.response && !e?.request) toast.error(e?.message || "Update failed");
    },
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-2xl font-bold">Profile</h2>

      {/* Weekly mood email status */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4">
        <div>
          <p className="text-sm font-medium text-gray-800">Weekly mood email</p>
          <p className="text-xs text-gray-500">
            {profile?.email
              ? `Summary goes to ${profile.email}`
              : "Add an email below to turn this on."}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            profile?.sentimentAnalysis
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {profile?.sentimentAnalysis ? "On" : "Off"}
        </span>
      </div>

      <form
        onSubmit={handleSubmit((d) => updateMutation.mutate(d))}
        className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6"
      >
        {isGoogle ? (
          <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-800">
            You signed in with Google, so no current password is needed. You can set a password below if you
            also want to log in with a username and password.
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Verify it's you</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current username</label>
                <input type="text" autoComplete="off" {...register("currentUsername")} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
                <input type="password" autoComplete="current-password" {...register("currentPassword")} className={inputCls} />
              </div>
            </div>
            <hr className="border-gray-100" />
          </>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">{isGoogle ? "Your details" : "New details"}</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isGoogle ? "Username" : "New username"}
              {isGoogle && <span className="text-gray-400"> (can't be changed for Google accounts)</span>}
            </label>
            <input
              type="text"
              readOnly={isGoogle}
              {...register("username")}
              className={`${inputCls} ${isGoogle ? "bg-gray-50 text-gray-500" : ""}`}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" {...register("email")} className={inputCls} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isGoogle ? "Set a password" : "New password"}{" "}
              <span className="text-gray-400">
                {isGoogle ? "(optional)" : "(leave blank to keep current)"}
              </span>
            </label>
            <input type="password" autoComplete="new-password" {...register("newPassword")} className={inputCls} />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <input type="password" autoComplete="new-password" {...register("confirmPassword")} className={inputCls} />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {updateMutation.isPending ? "Saving..." : "Update profile"}
        </button>
      </form>

      <div className="bg-white border border-red-200 rounded-xl p-8">
        <h3 className="font-semibold text-red-600 mb-2">Danger zone</h3>
        <p className="text-sm text-gray-600 mb-4">Deleting your account cannot be undone.</p>
        <button
          onClick={() => setShowDelete(true)}
          disabled={!profile?.username}
          className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          Delete account
        </button>
      </div>

      {showDelete && profile?.username && (
        <DeleteAccountModal
          username={profile.username}
          isGoogle={isGoogle}
          onClose={() => setShowDelete(false)}
        />
      )}
    </div>
  );
};