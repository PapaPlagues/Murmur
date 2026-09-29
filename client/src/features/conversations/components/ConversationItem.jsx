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
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-md p-3 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={onClick}
    >
      <Avatar>
        <AvatarImage src={avatar} alt={`${username}'s profile`} />
        <AvatarFallback>{username?.[0].toUpperCase()}</AvatarFallback>

        <AvatarBadge
          className={
            online
              ? "bg-green-600 dark:bg-green-800"
              : "bg-muted-foreground"
          }
          aria-hidden="true"
        />
      </Avatar>

      <div>
        <p>{username}</p>
        <p className="truncate text-sm text-muted-foreground">{lastMessage}</p>
      </div>
      <span className="sr-only">
        {username} is {online ? "online" : "offline"}
      </span>
    </button>
  );
};

export default ConversationItem;