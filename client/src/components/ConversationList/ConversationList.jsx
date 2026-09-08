import ConversationSearch from "@/features/conversations/components/ConversationSearch";
import ConversationItem from "@/features/conversations/components/ConversationItem";
import { useState, useEffect } from "react";
import useUserStore from "@/stores/userStore";

const ConversationList = ({ setSelectedConversation, setSelectedProfile }) => {
  const [showUsers, setShowUsers ] = useState(false);

  const getUsers = useUserStore((state) => state.getUsers);
  const users = useUserStore((state) => state.users);

  useEffect(() => {
    if (showUsers) {
      getUsers();
    }
  }, [showUsers, getUsers]); 

  const conversations = [
    {
      id: 1,
      username: "Alice",
      avatar: "https://i.pravatar.cc/150?img=47",
      lastMessage: "I've been pretty good! Just working on my project.",
      messages: [
        {
          id: 1,
          content: "Hey! How have you been?",
          createdAt: "2026-08-31T14:20:00",
          senderId: 2,
          sender: {
            username: "Alice",
            avatar: "https://i.pravatar.cc/150?img=47",
          },
        },
        {
          id: 2,
          content: "I've been pretty good! Just working on my project.",
          createdAt: "2026-08-31T14:22:00",
          senderId: 1,
          sender: {
            username: "Me",
            avatar: "/avatars/10.png",
          },
        },
        {
          id: 3,
          content: "Oh nice! What are you working on?",
          createdAt: "2026-08-31T14:23:00",
          senderId: 2,
          sender: {
            username: "Alice",
            avatar: "https://i.pravatar.cc/150?img=47",
          },
        },
        {
          id: 4,
          content:
            "A messaging app actually. I'm working on the chat window right now.",
          createdAt: "2026-08-31T14:25:00",
          senderId: 1,
          sender: {
            username: "Me",
            avatar: "/avatars/10.png",
          },
        },
        {
          id: 5,
          content: "That sounds cool! How's it going?",
          createdAt: "2026-08-31T14:27:00",
          senderId: 2,
          sender: {
            username: "Alice",
            avatar: "https://i.pravatar.cc/150?img=47",
          },
        },
      ],
    },

    {
      id: 2,
      username: "Bob",
      avatar: "https://i.pravatar.cc/150?img=12",
      lastMessage: "Let's get those workouts in 💪",
      messages: [
        {
          id: 6,
          content: "You going to the gym today?",
          createdAt: "2026-08-31T10:15:00",
          senderId: 2,
          sender: {
            username: "Bob",
            avatar: "https://i.pravatar.cc/150?img=12",
          },
        },
        {
          id: 7,
          content: "Yeah, probably around 6.",
          createdAt: "2026-08-31T10:18:00",
          senderId: 1,
          sender: {
            username: "Me",
            avatar: "/avatars/10.png",
          },
        },
        {
          id: 8,
          content: "Nice. I'm thinking legs today.",
          createdAt: "2026-08-31T10:20:00",
          senderId: 2,
          sender: {
            username: "Bob",
            avatar: "https://i.pravatar.cc/150?img=12",
          },
        },
        {
          id: 9,
          content: "Let's get those workouts in 💪",
          createdAt: "2026-08-31T10:22:00",
          senderId: 1,
          sender: {
            username: "Me",
            avatar: "/avatars/10.png",
          },
        },
      ],
    },

    {
      id: 3,
      username: "Charlie",
      avatar: "https://i.pravatar.cc/150?img=33",
      lastMessage: "That sounds good",
      messages: [
        {
          id: 10,
          content: "Want to grab food sometime this week?",
          createdAt: "2026-08-30T18:10:00",
          senderId: 2,
          sender: {
            username: "Charlie",
            avatar: "https://i.pravatar.cc/150?img=33",
          },
        },
        {
          id: 11,
          content: "Sure! How about Wednesday?",
          createdAt: "2026-08-30T18:12:00",
          senderId: 1,
          sender: {
            username: "Me",
            avatar: "/avatars/10.png",
          },
        },
        {
          id: 12,
          content: "Wednesday works for me.",
          createdAt: "2026-08-30T18:15:00",
          senderId: 2,
          sender: {
            username: "Charlie",
            avatar: "https://i.pravatar.cc/150?img=33",
          },
        },
        {
          id: 13,
          content: "That sounds good",
          createdAt: "2026-08-30T18:16:00",
          senderId: 1,
          sender: {
            username: "Me",
            avatar: "/avatars/10.png",
          },
        },
      ],
    },
  ];

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
  }

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
      <span className="text-xl">{showUsers ?  "×" : "+"}</span>
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
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          username={conversation.username}
          lastMessage={conversation.lastMessage}
          avatar={conversation.avatar}
          onClick={() => handleConversationClick(conversation)}
        />
      ))}
    </div>
  )}
</div>
    </section>
  );
};

export default ConversationList;
