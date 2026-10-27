import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "../../api/userApi";
import { TOKEN_KEY } from "../../api/axiosInstance";
import { Spinner } from "../../components/common/Spinner";

const profileSchema = z.object({
  username: z.string().min(3, "At least 3 characters"),
  email: z.string().email("Enter a valid email"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({ queryKey: ["profile"], queryFn: userApi.getProfile });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (profile) reset({ username: profile.username, email: profile.email });
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userApi.deleteAccount,
    onSuccess: () => {
      localStorage.removeItem(TOKEN_KEY);
      queryClient.clear();
      toast.success("Account deleted");
      navigate("/login");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Permanently delete your account and all entries?")) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) return <Spinner />;

  const inputCls =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none";

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-2xl font-bold">Profile</h2>

      <form
        onSubmit={handleSubmit((d) => updateMutation.mutate(d))}
        className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input type="text" {...register("username")} className={inputCls} />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" {...register("email")} className={inputCls} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <p className="text-xs text-gray-500">Role: {profile?.role}</p>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {updateMutation.isPending ? "Saving..." : "Save changes"}
        </button>
      </form>

      <div className="bg-white border border-red-200 rounded-xl p-8">
        <h3 className="font-semibold text-red-600 mb-2">Danger zone</h3>
        <p className="text-sm text-gray-600 mb-4">Deleting your account cannot be undone.</p>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          Delete account
        </button>
      </div>
    </div>
  );
};
