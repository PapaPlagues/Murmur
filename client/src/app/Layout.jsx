import { Outlet, useLocation, useNavigate } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/features/Sidebar/Sidebar";
import ConversationList from "@/components/ConversationList/ConversationList";
import useConvStore from "@/stores/convStore";

const Layout = () => {
  const location = useLocation();

  const isOwnProfile = location.pathname === "/profile" || location.pathname === "/profile/edit";

  const showConversationList = !isOwnProfile;

  const createConversation = useConvStore(
    (state) => state.createConversation
  );

  const navigate = useNavigate();

  const handleStartConversation = async (user) => {
    const conversation = await createConversation(user.id);
    navigate(`/conversations/${conversation.id}`);
  };

  return (
    <SidebarProvider>
      <AppSidebar />

      {showConversationList && <ConversationList />}

      <main className="flex min-h-screen flex-1 bg-background text-foreground">
        <Outlet context={{ handleStartConversation }}/>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
