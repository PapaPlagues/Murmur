import ConversationSearch from "@/features/conversations/components/ConversationSearch";
import ConversationItem from "@/features/conversations/components/ConversationItem";

const ConversationList = ({ setSelectedConversation }) => {
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

  return (
    <section className="w-80 border-r border-border bg-card p-4">
      <h2 className="text-lg font-semibold">Conversations</h2>

      <div>
        <ConversationSearch />
      </div>

      <div className="my-7">
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
    </section>
  );
};

export default ConversationList;
