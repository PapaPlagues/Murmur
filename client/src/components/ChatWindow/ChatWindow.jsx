import MessageBubble from "@/features/messages/components/MessageBubble";
import MessageInput from "@/features/messages/components/MessageInput";

const ChatWindow = ({ selectedConversation }) => {
  return (
    <section className="flex flex-1 flex-col bg-background">
      {selectedConversation === null ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Select a conversation</h2>
          <p className="mt-2 text-muted-foreground">
            Choose someone from your conversations to start chatting.
          </p>
        </div>
      ) : (
        <>
          {/* Conversation header */}
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold">{selectedConversation.username}</h2>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-6">
            <div className="mx-auto flex w-full flex-col gap-2">
              {selectedConversation.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          </div>

          {/* Input */}
          <MessageInput />
        </>
      )}
    </section>
  );
};

export default ChatWindow;
