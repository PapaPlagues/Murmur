import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";
import useAuthStore from "@/stores/authStore";
import { Link } from "react-router";

const MessageBubble = ({ message }) => {
  const currentUser = useAuthStore((state) => state.user);

  const isCurrentUser = message.sender.id === currentUser.id;

  return (
    <>
      <Message align={isCurrentUser ? "end" : "start"}>
        <MessageAvatar>
          <Link to={`/profile/${message.sender.id}`}>
            <Avatar>
              <AvatarImage
                src={message.sender.avatar}
                alt={message.sender.username}
              />
              <AvatarFallback>
                {message.sender.username?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        </MessageAvatar>

        <MessageContent>
          <MessageHeader>
            <Link to={`/profile/${message.sender.id}`}>
              {message.sender.displayName || message.sender.username}
            </Link>
          </MessageHeader>
          <Bubble variant={isCurrentUser ? "default" : "muted"}>
          {message.content && (
            <BubbleContent>{message.content}</BubbleContent>
          )}

          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt="Message attachment"
              className="max-w-sm rounded-lg object-cover"
            />
          )}
        </Bubble>
          <MessageFooter>
            <div>
              Sent{" "}
              <span className="font-normal">
                {new Date(message.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </MessageFooter>
        </MessageContent>
      </Message>
    </>
  );
};

export default MessageBubble;
