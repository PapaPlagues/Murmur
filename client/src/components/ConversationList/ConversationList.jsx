import ConversationSearch from "@/features/conversations/components/ConversationSearch";
import ConversationItem from "@/features/conversations/components/ConversationItem";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useUserStore from "@/stores/userStore";
import useConvStore from "@/stores/convStore";
import useAuthStore from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import ResourceState from "@/components/ResourceState";
import { MessageSquareText, Plus, SearchX, UsersRound, X } from "lucide-react";

const ConversationList = () => {
  const [showUsers, setShowUsers] = useState(false);
  const navigate = useNavigate();

  const getUsers = useUserStore((state) => state.getUsers);
  const users = useUserStore((state) => state.users);
  const usersLoadStatus = useUserStore((state) => state.usersLoadStatus);
  const usersLoadError = useUserStore((state) => state.usersLoadError);

  const conversations = useConvStore((state) => state.conversations);
  const getConversations = useConvStore((state) => state.getConversations);
  const conversationsLoadStatus = useConvStore((state) => state.loadStatus);
  const conversationsLoadError = useConvStore((state) => state.loadError);

  const currentUser = useAuthStore((state) => state.user);

  // Search Bar
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) => 
  user.username.toLowerCase().includes(search.toLowerCase()))

  const filteredConversations = conversations.filter((conversation) => {
    const otherMember = conversation.members.find(
                (member) => member.userId !== currentUser.id,
              );
    return otherMember.user.username.toLowerCase().includes(search.toLowerCase());
  });

  const filteredResults = showUsers ? filteredUsers : filteredConversations;


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
    <section className="flex min-h-0 min-w-0 w-full flex-col border-border bg-card p-4 md:h-full md:w-80 md:shrink-0 md:border-r">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {showUsers ? "People" : "Conversations"}
        </h2>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowUsers(!showUsers)}
          aria-label={showUsers ? "Close people list" : "Start a new conversation"}
          aria-expanded={showUsers}
          aria-controls="conversation-list-content"
        >
          {showUsers ? <X aria-hidden="true" /> : <Plus aria-hidden="true" />}
        </Button>
      </div>

      <div className="mt-4">
        <ConversationSearch
          search={search}
          setSearch={setSearch}
          filteredResults={filteredResults}
          label={showUsers ? "Search people" : "Search conversations"}
        />
      </div>

      <div id="conversation-list-content" className="murmur-scrollbar my-5 min-h-0 flex-1 overflow-y-auto md:my-7">
        {showUsers ? (
          <div>
            <p>Users</p>
            {(usersLoadStatus === "idle" || usersLoadStatus === "loading") && (
              <ResourceState
                icon={UsersRound}
                title="Loading people"
                description="Finding people you can message."
                loading
                className="min-h-40 px-0"
              />
            )}
            {usersLoadStatus === "error" && (
              <ResourceState
                icon={UsersRound}
                title="People couldn’t load"
                description={usersLoadError || "Check your connection and try again."}
                error
                actionLabel="Retry"
                onAction={getUsers}
                className="min-h-40 px-0"
              />
            )}
            {usersLoadStatus === "ready" && filteredUsers.length === 0 && (
              <ResourceState
                icon={users.length === 0 ? UsersRound : SearchX}
                title={users.length === 0 ? "No people yet" : "No matches"}
                description={users.length === 0
                  ? "There are no other people to message right now."
                  : "Try a different name or clear your search."}
                className="min-h-40 px-0"
              />
            )}
            {usersLoadStatus === "ready" && filteredUsers.map((user) => (
                <ConversationItem
                  key={user.id}
                  username={user.username}
                  avatar={user.avatar}
                  lastSeenAt={user.lastSeenAt}
                  onClick={() => handleProfileClick(user)}
                />
              ))}
          </div>
        ) : (
          <div>
            {(conversationsLoadStatus === "idle" || conversationsLoadStatus === "loading") && (
              <ResourceState
                icon={MessageSquareText}
                title="Loading conversations"
                description="Getting your recent messages."
                loading
                className="min-h-40 px-0"
              />
            )}
            {conversationsLoadStatus === "error" && (
              <ResourceState
                icon={MessageSquareText}
                title="Conversations couldn’t load"
                description={conversationsLoadError || "Check your connection and try again."}
                error
                actionLabel="Retry"
                onAction={getConversations}
                className="min-h-40 px-0"
              />
            )}
            {conversationsLoadStatus === "ready" && filteredConversations.length === 0 && (
              <ResourceState
                icon={conversations.length === 0 ? MessageSquareText : SearchX}
                title={conversations.length === 0 ? "No conversations yet" : "No matches"}
                description={conversations.length === 0
                  ? "Choose a person to start your first conversation."
                  : "Try another name or clear your search."}
                className="min-h-40 px-0"
              />
            )}
            {conversationsLoadStatus === "ready" && filteredConversations.map((conversation) => {
              const otherMember = conversation.members.find(
                (member) => member.userId !== currentUser.id,
              );

              return (
                <ConversationItem
                  key={conversation.id}
                  username={otherMember.user.username}
                  lastMessage={
                      conversation.messages?.[0]?.content ||
                      (conversation.messages?.[0]?.imageUrl ? "📷 Image" : null)
                    }
                  avatar={otherMember.user.avatar}
                  lastSeenAt={otherMember.user.lastSeenAt}
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
