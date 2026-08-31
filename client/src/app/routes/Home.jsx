import { SidebarProvider } from "@/components/ui/sidebar";

import AppSidebar from "@/features/Sidebar/Sidebar";
import ConversationList from "@/components/ConversationList/ConversationList";
import ChatWindow from "@/components/ChatWindow/ChatWindow";

const Home = () => {
    return (
        <SidebarProvider>
            <AppSidebar />

            <main className="flex min-h-screen flex-1 bg-gray-900 text-white">
                <ConversationList />
                <ChatWindow />
            </main>
        </SidebarProvider>
    );
};

export default Home;