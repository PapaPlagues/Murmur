import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";

import { MessageSquare, User, LogOut } from "lucide-react";

const AppSidebar = () => {
    return (
        <Sidebar className="border-r border-gray-800 text-white">
            <SidebarHeader className="border-b border-gray-800 bg-gray-950 p-4">
                <h1 className="text-2xl font-bold">
                    Murmur
                </h1>
            </SidebarHeader>

            <SidebarContent className="bg-gray-950 p-4">
                <button className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-gray-800">
                    <MessageSquare size={20} />
                    <span>Messages</span>
                </button>

                <button className="mt-2 flex w-full items-center gap-3 rounded-lg p-3 hover:bg-gray-800">
                    <User size={20} />
                    <span>Profile</span>
                </button>
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-800 bg-gray-950 p-4">
                <button className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-gray-800">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSidebar;