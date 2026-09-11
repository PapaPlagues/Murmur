import ConversationSearch from "@/features/conversations/components/ConversationSearch";
import ConversationItem from "@/features/conversations/components/ConversationItem";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useUserStore from "@/stores/userStore";
import useConvStore from "@/stores/convStore";
import useAuthStore from "@/stores/authStore";

const ConversationList = () => {
  const [showUsers, setShowUsers] = useState(false);
  const navigate = useNavigate();

  const getUsers = useUserStore((state) => state.getUsers);
  const users = useUserStore((state) => state.users);

  const conversations = useConvStore((state) => state.conversations);
  const getConversations = useConvStore((state) => state.getConversations);

  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    getConversations();
  }, [getConversations]);

  useEffect(() => {
    if (showUsers) {
      getUsers();
    }
  }, [showUsers, getUsers]);

  const handleConversationClick = (conversation) => {
    navigate(`/conversations/${conversation.id}`);
  };

  const handleProfileClick = (profile) => {
    navigate(`/profile/${profile.id}`);
  };

  return (
    <section className="w-80 border-r border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {showUsers ? "People" : "Conversations"}
        </h2>

        <button
          type="button"
          onClick={() => setShowUsers(!showUsers)}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
          aria-label="New conversation"
        >
          <span className="text-xl">{showUsers ? "×" : "+"}</span>
        </button>
      </div>

      <div className="mt-4">
        <ConversationSearch />
      </div>

      <div className="my-7">
        {showUsers ? (
          <div>
            <p>Users</p>
            {users.map((user) => (
              <ConversationItem
                key={user.id}
                username={user.username}
                avatar={user.avatar}
                onClick={() => handleProfileClick(user)}
              />
            ))}
          </div>
        ) : (
          <div>
            {conversations.map((conversation) => {
              const otherMember = conversation.members.find(
                (member) => member.userId !== currentUser.id,
              );

              return (
                <ConversationItem
                  key={conversation.id}
                  username={otherMember.user.username}
                  lastMessage={conversation.messages[0]?.content ?? null}
                  avatar={otherMember.user.avatar}
                  onClick={() => handleConversationClick(conversation)}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ConversationList;
