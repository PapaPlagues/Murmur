import { Outlet, useLocation, useNavigate } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/features/Sidebar/Sidebar";
import ConversationList from "@/components/ConversationList/ConversationList";
import useConvStore from "@/stores/convStore";
import useAuthStore from "@/stores/authStore";
import { useEffect } from "react";
import { sendHeartbeat } from "@/api/users";

const Layout = () => {
  const location = useLocation();

  const isOwnProfile =
    location.pathname === "/profile" || location.pathname === "/profile/edit";

  const showConversationList = !isOwnProfile;
  const showMobileConversationList = location.pathname === "/";

  const createConversation = useConvStore((state) => state.createConversation);
  const setLastSeenAt = useAuthStore((state) => state.setLastSeenAt);

  const navigate = useNavigate();

  const handleStartConversation = async (user) => {
    const conversation = await createConversation(user.id);
    navigate(`/conversations/${conversation.id}`);
  };

  useEffect(() => {
    let active = true;

    const heartbeat = async () => {
      try {
        const { lastSeenAt } = await sendHeartbeat();
        if (active && lastSeenAt) {
          setLastSeenAt(lastSeenAt);
        }
      } catch {
        // Presence is best-effort; the next heartbeat will retry.
      }
    };

    heartbeat();

    const interval = setInterval(heartbeat, 30_000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [setLastSeenAt]);

  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col md:contents">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 md:hidden">
          <SidebarTrigger aria-label="Open navigation menu" />
          <span className="text-base font-semibold">Murmur</span>
        </header>

        {showConversationList && (
          <div
            className={
              showMobileConversationList
                ? "flex min-h-0 min-w-0 flex-1 md:flex-none"
                : "hidden md:flex md:h-svh md:min-h-0 md:flex-col"
            }
          >
            <ConversationList />
          </div>
        )}

        <main
          className={`${showMobileConversationList ? "hidden md:flex" : "flex"} min-h-0 min-w-0 flex-1 bg-background text-foreground`}
        >
          <Outlet context={{ handleStartConversation }} />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
