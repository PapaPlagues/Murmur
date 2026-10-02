import MessageBubble from "./MessageBubble";
import { useEffect, useRef } from "react";

export const MessageList = ({ messages }) => {
  // Scroll down to newest message
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="murmur-scrollbar min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-2">
        {messages?.map((message, index) => {
          const previousMessage = messages[index - 1];
          const nextMessage = messages[index + 1];

          const isNewDay =
            !previousMessage ||
            new Date(message.createdAt).toDateString() !==
              new Date(previousMessage.createdAt).toDateString();
          const isNewSender =
            !previousMessage || previousMessage.sender.id !== message.sender.id;

          const startsNewGroup = isNewDay || isNewSender;

          const isLastFromSender =
            !nextMessage ||
            nextMessage.sender.id !== message.sender.id ||
            new Date(nextMessage.createdAt).toDateString() !==
              new Date(message.createdAt).toDateString();

          return (
            <div key={message.id}>
              {isNewDay && (
                <div className="my-4 text-center text-sm text-muted-foreground">
                  {new Date(message.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              )}

              <MessageBubble
                message={message}
                showSender={startsNewGroup}
                showTime={isLastFromSender}
              />
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
