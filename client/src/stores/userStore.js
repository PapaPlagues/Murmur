import {
  getUsers as getUsersApi,
  getUser as getUserApi,
  updateUser as updateUserApi,
  updateAvatar as updateAvatarApi,
  updateBanner as updateBannerApi,
} from "@/api/users";

import { create } from "zustand";

let latestUsersLoadId = 0;

const useUserStore = create((set) => ({
  users: [],
  selectedUser: null,
  usersLoadStatus: "idle",
  usersLoadError: null,

  getUsers: async () => {
    const loadId = ++latestUsersLoadId;
    set({ usersLoadStatus: "loading", usersLoadError: null });

    try {
      const users = await getUsersApi();
      if (loadId === latestUsersLoadId) {
        set({ users, usersLoadStatus: "ready" });
      }
      return true;
    } catch (error) {
      if (loadId === latestUsersLoadId) {
        set({
          usersLoadStatus: "error",
          usersLoadError: error.message || "Unable to load people.",
        });
      }
      return false;
    }
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
  },

  updateBanner: async (file) => {
    const user = await updateBannerApi(file);
    return user;
  }
}));

export default useUserStore;
