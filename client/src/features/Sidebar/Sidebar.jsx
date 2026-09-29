import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { MessageSquare, User, Ghost } from "lucide-react";
import { Link } from "react-router";
import { LogOutButton } from "./LogoutButton";

const AppSidebar = () => {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="border-border text-foreground">
      <SidebarHeader className="border-b border-border bg-sidebar p-4">
        <div className="flex items-center gap-2">
          <Ghost size={24} />
          <h1 className="text-2xl font-bold">Murmur</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar p-4">
        <Link
          to="/"
          onClick={() => setOpenMobile(false)}
          className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-muted"
        >
          <MessageSquare size={20} />
          <span>Messages</span>
        </Link>

        <Link
          to="/profile"
          onClick={() => setOpenMobile(false)}
          className="mt-2 flex w-full items-center gap-3 rounded-lg p-3 hover:bg-muted"
        >
          <User size={20} />
          <span>Profile</span>
        </Link>
      </SidebarContent>

      <SidebarFooter className="border-t border-border bg-sidebar p-4">
        <LogOutButton />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
