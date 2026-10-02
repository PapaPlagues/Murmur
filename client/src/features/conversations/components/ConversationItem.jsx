import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { isUserOnline } from "@/utils/presence";

const ConversationItem = ({
  username,
  displayName,
  lastMessage,
  avatar,
  lastSeenAt,
  isActive = false,
  onClick,
}) => {
  const online = isUserOnline(lastSeenAt);

  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      className={`flex w-full min-w-0 items-center gap-3 rounded-md p-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isActive ? "bg-muted" : ""}`}
      onClick={onClick}
    >
      <Avatar>
        <AvatarImage src={avatar} alt={`${username}'s profile`} />
        <AvatarFallback>{username?.[0]?.toUpperCase()}</AvatarFallback>

        <AvatarBadge
          className={
            online ? "bg-green-600 dark:bg-green-800" : "bg-muted-foreground"
          }
          aria-hidden="true"
        />
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{displayName || username}</p>
        {username && (
          <p className="truncate text-xs text-muted-foreground pb-1">
            @{username}
          </p>
        )}
        {lastMessage !== undefined && (
          <p className="truncate text-sm text-muted-foreground">
            {lastMessage || "No messages yet"}
          </p>
        )}
      </div>
      <span className="sr-only">
        {username} is {online ? "online" : "offline"}
      </span>
    </button>
  );
};

export default ConversationItem;
