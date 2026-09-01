import ConversationList from "@/components/ConversationList/ConversationList";
import ChatWindow from "@/components/ChatWindow/ChatWindow";
import { useState } from "react";

const Home = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <>
      <ConversationList setSelectedConversation={setSelectedConversation} />
      <ChatWindow selectedConversation={selectedConversation} />
    </>
  );
};

export default Home;
