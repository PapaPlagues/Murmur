import {
  getMessages as getMessagesApi,
  createMessage as createMessageApi,
} from "@/api/messages";

import { create } from "zustand";

let latestLoadId = 0;

const useMessageStore = create((set) => ({
  messages: [],
  conversationId: null,
  loadStatus: "idle",
  loadError: null,

  getMessages: async (conversationId) => {
    const loadId = ++latestLoadId;
    set({
      messages: [],
      conversationId,
      loadStatus: "loading",
      loadError: null,
    });

    try {
      const messages = await getMessagesApi(conversationId);
      if (loadId === latestLoadId) {
        set({ messages, loadStatus: "ready" });
      }
      return true;
    } catch (err) {
      if (loadId === latestLoadId) {
        set({
          loadStatus: "error",
          loadError: err.message || "Unable to load messages.",
        });
      }
      return false;
    }
  },

  sendMessage: async (conversationId, messageData) => {
    const message = await createMessageApi(conversationId, messageData);

    set((state) =>
      state.conversationId === conversationId
        ? { messages: [...state.messages, message] }
        : state,
    );

    return message;
  },
}));

export default useMessageStore;
