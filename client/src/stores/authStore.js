import {
  login as loginApi,
  guestLogin as guestLoginApi,
  getCurrentUser as getCurrentUserApi,
  logout as logoutApi,
} from "@/api/auth";

import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setLastSeenAt: (lastSeenAt) =>
    set((state) =>
      state.user ? { user: { ...state.user, lastSeenAt } } : {},
    ),

  login: async (formData) => {
    await loginApi(formData);
    const user = await getCurrentUserApi();
    set({ user, isLoading: false });
  },

  guestLogin: async () => {
    await guestLoginApi();
    const user = await getCurrentUserApi();
    set({ user, isLoading: false });
  },

  getCurrentUser: async () => {
    try {
      const user = await getCurrentUserApi();
      set({ user });
    } catch {
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await logoutApi();

    set({ user: null, isLoading: false });
  },
}));

export default useAuthStore;
