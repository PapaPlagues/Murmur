import ConversationSearch from "@/features/conversations/components/ConversationSearch";

const ConversationList = () => {

    const conversations = [
        {
            id: 1,
            username: "Alice",
            lastMessage: "Hey, how are you?",
        },
        {
            id: 2,
            username: "Bob",
            lastMessage: "Let's get those workouts in",
        },
        {
            id: 3,
            username: "Charlie",
            lastMessage: "That sounds good"
        },
    ];

    return (
        <section className="w-80 border-r border-gray-800 bg-gray-900 p-4">
            <h2 className="text-lg font-semibold">
                Conversations
            </h2>

            <div>
                <ConversationSearch />
            </div>
            
        </section>
    );
};

export default ConversationList;