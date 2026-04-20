import { create } from "zustand";
import { persist } from "zustand/middleware";
import blogService from "../services/blogs";
import loginService from "../services/login.js";
import useNotificationStore from "./notificationStore.js";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,

      login: async (credentials) => {
        try {
          const user = await loginService.login(credentials);

          set({ user });
          blogService.setToken(user.token);

          useNotificationStore.getState().actions.notify({
            message: `Logged in`,
            type: "success",
          });
        } catch (err) {
          useNotificationStore.getState().actions.notify({
            message: err.response?.data?.error || "Something went wrong",
            type: "error",
          });

          throw err;
        }
      },

      logout: () => {
        set({ user: null });
        blogService.setToken(null);
        useNotificationStore.getState().actions.notify({
          message: `Logged out`,
          type: "success",
        });
      },
    }),
    {
      name: "loggedUser",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          blogService.setToken(state.user.token);
        }
      },
    },
  ),
);

export const useAuth = () => useAuthStore((state) => state.user);

export const useAuthActions = () => {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return { login, logout };
};
