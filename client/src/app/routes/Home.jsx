import ConversationList from "@/components/ConversationList/ConversationList";
import ChatWindow from "@/components/ChatWindow/ChatWindow";
import { useState } from "react";

const Home = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setSelectedProfile(null);
  };

  const handleSelectProfile = (user) => {
    setSelectedProfile(user);
    setSelectedConversation(null);
  };

  return (
    <>
      <ConversationList 
      setSelectedConversation={handleSelectConversation} 
      setSelectedProfile={handleSelectProfile} 
      />
      <ChatWindow
       selectedConversation={selectedConversation}
       selectedProfile={selectedProfile}
      />
    </>
  );
};

export default Home;
