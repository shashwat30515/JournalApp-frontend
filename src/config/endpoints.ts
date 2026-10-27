// Single place to edit backend paths (server: http://localhost:8080)
export const ENDPOINTS = {
  auth: {
    register: "/public/create-user",
    login: "/login",
  },
  user: {
    me: "/user",
  },
  journal: {
    base: "/journal",
    byId: (id: string) => `/journal/id/${id}`,
  },
  admin: {
    allUsers: "/admin/all-users-get",
    createAdmin: "/admin/create-admin-user",
  },
} as const;
