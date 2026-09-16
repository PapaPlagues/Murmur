import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { isUserOnline } from "@/utils/presence";

const ConversationItem = ({ username, lastMessage, avatar, lastSeenAt, onClick }) => {

  const online = isUserOnline(lastSeenAt);

  return (
    <div
      className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer"
      onClick={onClick}
    >
      <Avatar>
        <AvatarImage src={avatar} alt="profile picture" />
        <AvatarFallback>{username?.[0].toUpperCase()}</AvatarFallback>

        <AvatarBadge
          className={
            online
              ? "bg-green-600 dark:bg-green-800"
              : "bg-muted-foreground"
          }
        />
        
      </Avatar>

      <div>
        <p>{username}</p>
        <p className="truncate text-sm text-muted-foreground">{lastMessage}</p>
      </div>
    </div>
  );
};

export default ConversationItem;