import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/features/Sidebar/Sidebar";


const Layout = () => {
    return (
        <SidebarProvider>
            <AppSidebar />

            <main className="flex min-h-screen flex-1 bg-gray-900 text-white">
                <Outlet />
            </main>
        </SidebarProvider>
    )
};

export default Layout;