import {
  createConversation as createConversationApi,
  getConversations as getConversationsApi,
  getConversation as getConversationApi,
} from "@/api/conversations";

import { create } from "zustand";

let latestConversationsLoadId = 0;

const useConvStore = create((set) => ({
  conversations: [],
  loadStatus: "idle",
  loadError: null,

  getConversations: async () => {
    const loadId = ++latestConversationsLoadId;
    set({ loadStatus: "loading", loadError: null });

    try {
      const conversations = await getConversationsApi();
      if (loadId === latestConversationsLoadId) {
        set({ conversations, loadStatus: "ready" });
      }
      return true;
    } catch (error) {
      if (loadId === latestConversationsLoadId) {
        set({
          loadStatus: "error",
          loadError: error.message || "Unable to load conversations.",
        });
      }
      return false;
    }
  },

  getConversation: async (conversationId) => {
    return await getConversationApi(conversationId);
  },

  updateLatestMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, messages: [message] }
          : conversation,
      ),
    })),

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
