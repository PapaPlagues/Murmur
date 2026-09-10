import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const ConversationItem = ({ username, lastMessage, avatar, onClick }) => {
  return (
    <div
      className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer"
      onClick={onClick}
    >
      <Avatar className="h-11 w-11">
        <AvatarImage src={avatar} alt="profile picture" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
      </Avatar>

      <div>
        <p>{username}</p>
        <p className="truncate text-sm text-muted-foreground">
          {lastMessage}
        </p>
      </div>
    </div>
  );
};

export default ConversationItem;
