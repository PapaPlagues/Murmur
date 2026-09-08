import { 
    getUsers as getUsersApi,
    getUser as getUserApi, 
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
}));

export default useUserStore;