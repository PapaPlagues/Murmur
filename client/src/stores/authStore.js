import { login as loginApi, getCurrentUser } from "@/api/auth";
import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: null,
  user: null,

  login: async (formData) => {
    const data = await loginApi(formData);

    set({ token: data.token });

    const user = await getCurrentUser(data.token);

    set({ user });
  },

  getCurrentUser: async (token) => {
    const data = await getCurrentUser(token);

    set({ user: data });
  },

  logout: () => set({ token: null, user: null }),
}));

export default useAuthStore;
