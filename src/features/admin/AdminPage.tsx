import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "../../api/userApi";
import { Spinner } from "../../components/common/Spinner";

const adminSchema = z.object({
  username: z.string().min(3, "At least 3 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});

type AdminFormData = z.infer<typeof adminSchema>;

export const AdminPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({ queryKey: ["users"], queryFn: userApi.getAllUsers });

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

  const inputCls =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none";

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold">Admin Panel</h2>

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
                  <th className="px-6 py-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(users ?? []).map((u) => (
                  <tr key={u.id ?? u.username}>
                    <td className="px-6 py-3">{u.username}</td>
                    <td className="px-6 py-3">{u.email}</td>
                    <td className="px-6 py-3">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="max-w-md">
        <h3 className="text-lg font-semibold mb-3">Create admin user</h3>
        <form
          onSubmit={handleSubmit((d) => createMutation.mutate(d))}
          className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
        >
          <div>
            <input placeholder="Username" {...register("username")} className={inputCls} />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <input placeholder="Email" type="email" {...register("email")} className={inputCls} />
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
