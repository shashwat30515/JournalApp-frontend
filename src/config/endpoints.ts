// Single place to edit backend paths (server: http://localhost:8080)
export const ENDPOINTS = {
  auth: {
    register: "/public/create-user",
    login: "/public/login",
    googleCallback: "/public/auth/google/callback",
  },
  user: {
    me: "/user",
    greeting: "/user/greeting", 
  },
  journal: {
    base: "/journal",
    byId: (id: string) => `/journal/id/${id}`,
  },
  admin: {
    allUsers: "/admin/all-users",
    createAdmin: "/admin/create-admin-user",
    makeAdmin: (id: string) => `/admin/make-admin/${id}`,
    removeAdmin: (id: string) => `/admin/remove-admin/${id}`,
    deleteUser: (id: string) => `/admin/delete-user/${id}`,
    allJournals: "/admin/all-journal-entries",
  },
} as const;