import {
  getUsers as getUsersApi,
  getUser as getUserApi,
  updateUser as updateUserApi,
} from "@/api/users";

import { create } from "zustand";

const useUserStore = create((set) => ({
  users: [],
  selectedUser: null,

  getUsers: async () => {
    const users = await getUsersApi();
    set({ users });
  },

  getUser: async (userId) => {
    const user = await getUserApi(userId);
    set({ selectedUser: user });
  },

  updateUser: async (formData) => {
    const user = await updateUserApi(formData);
    return user;
  },
}));

export default useUserStore;
