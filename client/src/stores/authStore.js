import {
  login as loginApi,
  getCurrentUser as getCurrentUserApi,
  logout as logoutApi,
} from "@/api/auth";

import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({user}),

  login: async (formData) => {
    await loginApi(formData);
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
