import ChatWindow from "@/components/ChatWindow/ChatWindow";
import useConvStore from "@/stores/convStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const Home = () => {
  const { conversationId } = useParams();

  const getConversation = useConvStore((state) => state.getConversation);

  const [conversationState, setConversationState] = useState({
    conversationId: null,
    retryCount: -1,
    status: "idle",
    conversation: null,
    error: null,
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!conversationId) return;

    let active = true;

    const loadConversation = async () => {
      try {
        const conversation = await getConversation(conversationId);
        if (active) {
          setConversationState({
            conversationId,
            retryCount,
            status: "ready",
            conversation,
            error: null,
          });
        }
      } catch (error) {
        if (active) {
          setConversationState({
            conversationId,
            retryCount,
            status: error.status === 404 ? "not-found" : "error",
            conversation: null,
            error: error.message || "Unable to load this conversation.",
          });
        }
      }
    };

    loadConversation();
    return () => {
      active = false;
    };
  }, [conversationId, getConversation, retryCount]);

  const isCurrentConversation =
    conversationState.conversationId === conversationId &&
    conversationState.retryCount === retryCount;
  const status = conversationId
    ? isCurrentConversation
      ? conversationState.status
      : "loading"
    : "idle";

  return (
    <ChatWindow
      selectedConversation={
        status === "ready" ? conversationState.conversation : null
      }
      conversationStatus={status}
      conversationError={conversationState.error}
      onRetryConversation={() => setRetryCount((count) => count + 1)}
    />
  );
};

export default Home;
