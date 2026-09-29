import MessageInput from "@/features/messages/components/MessageInput";
import UserProfile from "@/features/profile/UserProfile";
import useAuthStore from "@/stores/authStore";
import useMessageStore from "@/stores/messageStore";
import { useEffect } from "react";
import { MessageList } from "@/features/messages/components/MessageList";
import ResourceState from "@/components/ResourceState";
import { MessageSquareText, MessagesSquare } from "lucide-react";

const ChatWindow = ({
  selectedConversation,
  selectedProfile,
  onMessage,
  conversationStatus = "idle",
  conversationError,
  onRetryConversation,
}) => {
  const currentUser = useAuthStore((state) => state.user);

  const otherMember = selectedConversation?.members.find(
    (member) => member.userId !== currentUser.id,
  );

  const messages = useMessageStore((state) => state.messages);
  const messageConversationId = useMessageStore((state) => state.conversationId);
  const messageLoadStatus = useMessageStore((state) => state.loadStatus);
  const messageLoadError = useMessageStore((state) => state.loadError);
  const sendMessage = useMessageStore((state) => state.sendMessage);
  const getMessages = useMessageStore((state) => state.getMessages);

  useEffect(() => {
    if (!selectedConversation?.id) return;

    getMessages(selectedConversation.id);
  }, [selectedConversation?.id, getMessages]);

  const handleSendMessage = async (content, fileImage) => {
    await sendMessage(selectedConversation.id, { content, fileImage });
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-background">
  {selectedProfile ? (
    <UserProfile user={selectedProfile} onMessage={onMessage} />
  ) : selectedConversation ? (
    <>
      {/* Conversation header */}
      <div className="shrink-0 border-b border-border px-4 py-3 sm:px-6 sm:py-4">
        <h2 className="truncate font-semibold">
          {otherMember?.user.displayName || otherMember?.user.username}
        </h2>
      </div>

      {/* Messages */}
      {messageConversationId !== selectedConversation.id ||
      messageLoadStatus === "idle" ||
      messageLoadStatus === "loading" ? (
        <ResourceState
          icon={MessagesSquare}
          title="Loading messages"
          description="Your conversation is on its way."
          loading
          className="min-h-0 flex-1"
        />
      ) : messageLoadStatus === "error" ? (
        <ResourceState
          icon={MessagesSquare}
          title="Messages couldn’t load"
          description={messageLoadError || "Check your connection and try again."}
          error
          actionLabel="Retry"
          onAction={() => getMessages(selectedConversation.id)}
          className="min-h-0 flex-1"
        />
      ) : messages.length === 0 ? (
        <ResourceState
          icon={MessageSquareText}
          title="A quiet start"
          description="No messages here yet. Send the first one below."
          className="min-h-0 flex-1"
        />
      ) : (
        <MessageList messages={messages} />
      )}

      {/* Input */}
      <div className="shrink-0">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </>
  ) : conversationStatus === "loading" ? (
    <ResourceState
      icon={MessagesSquare}
      title="Loading conversation"
      description="Opening your messages."
      loading
      className="flex-1"
    />
  ) : conversationStatus === "not-found" ? (
    <ResourceState
      icon={MessagesSquare}
      title="Conversation unavailable"
      description="This conversation may have been removed, or you may not have access."
      error
      className="flex-1"
    />
  ) : conversationStatus === "error" ? (
    <ResourceState
      icon={MessagesSquare}
      title="Conversation couldn’t load"
      description={conversationError || "Check your connection and try again."}
      error
      actionLabel="Retry"
      onAction={onRetryConversation}
      className="flex-1"
    />
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
