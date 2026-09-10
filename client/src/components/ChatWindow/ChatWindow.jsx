import MessageBubble from "@/features/messages/components/MessageBubble";
import MessageInput from "@/features/messages/components/MessageInput";
import UserProfile from "@/features/profile/UserProfile";
import useAuthStore from "@/stores/authStore";
import useMessageStore from "@/stores/messageStore";
import { useEffect } from "react";

const ChatWindow = ({ selectedConversation, selectedProfile, onMessage }) => {
  const currentUser = useAuthStore((state) => state.user);

  const otherMember = selectedConversation?.members.find(
    (member) => member.userId !== currentUser.id
  );

  const messages = useMessageStore((state) => state.messages);
  const sendMessage = useMessageStore((state) => state.sendMessage);
  const getMessages = useMessageStore((state) => state.getMessages);

  useEffect(() => {
    if (!selectedConversation?.id) return;

    getMessages(selectedConversation.id);
  }, [selectedConversation?.id, getMessages]);

  const handleSendMessage = async (content) => {
    await sendMessage(selectedConversation.id, {content});
  };


  return (
    <section className="flex flex-1 flex-col bg-background">
      {selectedProfile ? (
        <UserProfile user={selectedProfile} onMessage={onMessage} />
      ) : selectedConversation ? (
        <>
          {/* Conversation header */}
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold">
              {otherMember?.user.displayName || otherMember?.user.username}
            </h2>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-6">
            <div className="mx-auto flex w-full flex-col gap-2">
              {messages?.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          </div>

          {/* Input */}
          <MessageInput onSend={handleSendMessage}/>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Select a conversation</h2>

          <p className="mt-2 text-muted-foreground">
            Choose someone from your conversations to start chatting.
          </p>
        </div>
      )}
    </section>
  );
};

export default ChatWindow;
