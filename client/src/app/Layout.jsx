import { Outlet, useLocation, useNavigate } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/features/Sidebar/Sidebar";
import ConversationList from "@/components/ConversationList/ConversationList";
import useConvStore from "@/stores/convStore";
import { useEffect } from "react";
import { sendHeartbeat } from "@/api/users";

const Layout = () => {
  const location = useLocation();

  const isOwnProfile =
    location.pathname === "/profile" || location.pathname === "/profile/edit";

  const showConversationList = !isOwnProfile;

  const createConversation = useConvStore((state) => state.createConversation);

  const navigate = useNavigate();

  const handleStartConversation = async (user) => {
    const conversation = await createConversation(user.id);
    navigate(`/conversations/${conversation.id}`);
  };

 useEffect(() => {
  const heartbeat = () => {
    sendHeartbeat().catch((err) => {
      console.error("Heartbeat failed:", err);
    });
  };

  heartbeat();

  const interval = setInterval(heartbeat, 30_000);

  return () => clearInterval(interval);
}, []);

  return (
    <SidebarProvider>
      <AppSidebar />

      {showConversationList && <ConversationList />}

      <main className="flex min-h-0 flex-1 bg-background text-foreground">
        <Outlet context={{ handleStartConversation }} />
      </main>
    </SidebarProvider>
  );
};

export default Layout;
