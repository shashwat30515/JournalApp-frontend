import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "../../api/userApi";
import { Spinner } from "../../components/common/Spinner";

const adminSchema = z.object({
  username: z.string().min(3, "At least 3 characters"),
  email: z
    .string()
    .optional()
    .refine((v) => !v || /^\S+@\S+\.\S+$/.test(v), "Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});

type AdminFormData = z.infer<typeof adminSchema>;

// Handles roles: ["USER","ADMIN"], role: "ADMIN", or authorities: [{ authority: "ROLE_ADMIN" }]
const getRoles = (u: any): string[] => {
  const list: any[] = [
    ...(Array.isArray(u?.roles) ? u.roles : []),
    ...(u?.role ? [u.role] : []),
    ...(Array.isArray(u?.authorities)
      ? u.authorities.map((a: any) => (typeof a === "string" ? a : a?.authority))
      : []),
  ];
  return list
    .filter((r) => typeof r === "string")
    .map((r) => r.replace(/^ROLE_/, ""));
};

// Handles id as a string or { $oid: "..." }
const getId = (u: any): string => {
  const raw = u?.id ?? u?._id;
  if (typeof raw === "string") return raw;
  return raw?.$oid ?? raw?.hexString ?? "";
};

export const AdminPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: userApi.getAllUsers,
  });

  // current logged-in user (to block changes on your own account)
  const { data: me } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminFormData>({ resolver: zodResolver(adminSchema) });

  const createMutation = useMutation({
    mutationFn: userApi.createAdminUser,
    onSuccess: () => {
      toast.success("Admin user created");
      reset();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const makeAdminMutation = useMutation({
    mutationFn: (id: string) => userApi.adminMakeAdmin(id),
    onSuccess: () => {
      toast.success("User is now an admin");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const removeAdminMutation = useMutation({
    mutationFn: (id: string) => userApi.adminRemoveAdmin(id),
    onSuccess: () => {
      toast.success("Admin role removed");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userApi.adminDeleteUser(id),
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["adminJournals"] });
    },
  });

  const onSubmit = (d: AdminFormData) => {
    const payload: { username: string; password: string; email?: string } = {
      username: d.username,
      password: d.password,
    };
    if (d.email && d.email.trim()) payload.email = d.email.trim();
    createMutation.mutate(payload);
  };

  const inputCls =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none";

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <Link
          to="/admin/journal"
          className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50"
        >
          View all journal entries
        </Link>
      </div>

      <section>
        <h3 className="text-lg font-semibold mb-3">All users</h3>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Roles</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(users ?? []).map((u: any, i: number) => {
                  const roles = getRoles(u);
                  const isAlreadyAdmin = roles.some((r) => r.toUpperCase() === "ADMIN");
                  const id = getId(u);
                  const name = u.username ?? u.userName;
                  const isMe = !!me?.username && me.username === name;

                  return (
                    <tr key={id || name || i}>
                      <td className="px-6 py-3">
                        {name}
                        {isMe && <span className="ml-2 text-xs text-gray-400">(you)</span>}
                      </td>
                      <td className="px-6 py-3 text-gray-600">{u.email ?? u.mail ?? "—"}</td>
                      <td className="px-6 py-3">
                        <div className="flex flex-wrap gap-1">
                          {roles.map((r) => (
                            <span
                              key={r}
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                r.toUpperCase() === "ADMIN"
                                  ? "bg-indigo-100 text-indigo-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {!isAlreadyAdmin ? (
                            <button
                              onClick={() => {
                                if (window.confirm(`Make ${name} an admin?`)) {
                                  makeAdminMutation.mutate(id);
                                }
                              }}
                              disabled={!id || makeAdminMutation.isPending}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-40"
                            >
                              Make admin
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (window.confirm(`Remove admin role from ${name}?`)) {
                                  removeAdminMutation.mutate(id);
                                }
                              }}
                              disabled={!id || isMe || removeAdminMutation.isPending}
                              title={isMe ? "You cannot remove your own admin role" : "Remove admin role"}
                              className="px-3 py-1.5 text-xs font-medium text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-50 disabled:opacity-40"
                            >
                              Remove admin
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Delete ${name}? Their account and all journal entries will be removed. This cannot be undone.`
                                )
                              ) {
                                deleteMutation.mutate(id);
                              }
                            }}
                            disabled={!id || isMe || deleteMutation.isPending}
                            title={isMe ? "You cannot delete your own account here" : "Delete user"}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-40"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="max-w-md">
        <h3 className="text-lg font-semibold mb-3">Create admin user</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
        >
          <div>
            <input placeholder="Username" {...register("username")} className={inputCls} />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <input placeholder="Email (optional)" type="email" {...register("email")} className={inputCls} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input placeholder="Password" type="password" {...register("password")} className={inputCls} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating..." : "Create admin"}
          </button>
        </form>
      </section>
    </div>
  );
};