import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../api/authApi";

import { toast } from "sonner";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { startGoogleLogin } from "../../utils/googleAuth";
import { setToken, setLoginMethod } from "../../api/axiosInstance";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // shows why you were logged out (expired session, etc.)
  useEffect(() => {
    const reason = sessionStorage.getItem("logout_reason");
    if (reason) {
      toast.error(reason);
      sessionStorage.removeItem("logout_reason");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormData) => {
    setIsLoading(true);
    try {
      const { token } = await authApi.login(values);
      setToken(token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (e: any) {
      // HTTP and network errors already show a toast in the interceptor
      if (!e?.response && !e?.request) toast.error(e?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <BookOpen className="w-7 h-7 text-indigo-600" />
          <h1 className="text-2xl font-bold">JournalApp</h1>
        </div>
        <h2 className="text-lg font-semibold mb-6 text-center">Sign in to your account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              {...register("username")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
          <button
        type="button"
  onClick={startGoogleLogin}
  className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
>
  Continue with Google
</button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};