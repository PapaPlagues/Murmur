import ChatWindow from "@/components/ChatWindow/ChatWindow";
import useConvStore from "@/stores/convStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const Home = () => {
  const { conversationId } = useParams();

  const getConversation = useConvStore((state) => state.getConversation);

  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    if (!conversationId) {
      setSelectedConversation(null);
      return;
    }

    const loadConversation = async () => {
      try {
        const conversation = await getConversation(conversationId);
        setSelectedConversation(conversation);
      } catch (error) {
        console.error(error);
        setSelectedConversation(null);
      }
    };

    loadConversation();
  }, [conversationId, getConversation]);

  return (
    <>
      <ChatWindow selectedConversation={selectedConversation} />
    </>
  );
};

export default Home;
