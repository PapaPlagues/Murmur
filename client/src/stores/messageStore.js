import {
  getMessages as getMessagesApi,
  createMessage as createMessageApi,
} from "@/api/messages";

import { create } from "zustand";

const useMessageStore = create((set) => ({
  messages: [],
  isLoading: false,

  getMessages: async (conversationId) => {
    set({ isLoading: true });
    try {
      const messages = await getMessagesApi(conversationId);
      set({ messages });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (conversationId, formData) => {
    const message = await createMessageApi(conversationId, formData);

    set((state) => ({
      messages: [...state.messages, message],
    }));

    return message;
  },
}));

export default useMessageStore;
