import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";

const currentUserId = 1;

const MessageBubble = ({ message }) => {
  const isCurrentUser = message.senderId === currentUserId;

  return (
    <>
      <Message align={isCurrentUser ? "end" : "start"}>
        <MessageAvatar>
          <Avatar>
            <AvatarImage
              src={
                isCurrentUser
                  ? "https://i.pravatar.cc/150?img=4"
                  : message.sender.avatar
              }
              alt={isCurrentUser ? "@me" : "@alice"}
            />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </MessageAvatar>

        <MessageContent>
          <Bubble variant={isCurrentUser ? "default" : "muted"}>
            <BubbleContent>{message.content}</BubbleContent>
          </Bubble>
          <MessageFooter>
            <div>
              Read <span className="font-normal">Yesterday</span>
            </div>
          </MessageFooter>
        </MessageContent>
      </Message>
    </>
  );
};

export default MessageBubble;
