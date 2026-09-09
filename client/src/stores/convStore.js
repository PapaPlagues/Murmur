import {
  createConversation as createConversationApi,
  getConversations as getConversationsApi,
  getConversation as getConversationApi,
} from "@/api/conversations";

import { create } from "zustand";

const useConvStore = create((set) => ({
  conversations: [],
  isLoading: false,

  getConversations: async () => {
    set({ isLoading: true });
    try {
      const conversations = await getConversationsApi();
      set({ conversations });
    } finally {
      set({ isLoading: false });
    }
  },

  getConversation: async (conversationId) => {
    return await getConversationApi(conversationId);
  },

  createConversation: async (userId) => {
    const conversation = await createConversationApi({ userId });

    set((state) => {
      // Don't add a duplicate if it already exists
      const exists = state.conversations.some(
        (item) => item.id === conversation.id,
      );

      if (exists) {
        return state;
      }

      return {
        conversations: [...state.conversations, conversation],
      };
    });

    return conversation;
  },
}));

export default useConvStore;
