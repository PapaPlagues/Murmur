import {
  getUsers as getUsersApi,
  getUser as getUserApi,
  updateUser as updateUserApi,
  updateAvatar as updateAvatarApi,
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

  updateAvatar: async (file) => {
    const user = await updateAvatarApi(file);
    return user;
  }
}));

export default useUserStore;
