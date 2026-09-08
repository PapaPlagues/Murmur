import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import useAuthStore from "@/stores/authStore";

export const LogOutButton = () => {
    const logoutUser = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    return(
        <button
        onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-muted"
        >
            <LogOut size={20} />
            <span>Logout</span>
        </button>
    );
};