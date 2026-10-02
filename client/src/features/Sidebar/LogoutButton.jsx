import { LoaderCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import useAuthStore from "@/stores/authStore";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const LogOutButton = () => {
  const logoutUser = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError("");
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      setLogoutError(error.message || "Unable to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div>
      {logoutError && (
        <p role="alert" className="mb-2 text-sm text-destructive">
          {logoutError}
        </p>
      )}
      <Button
        type="button"
        variant="ghost"
        disabled={isLoggingOut}
        onClick={handleLogout}
        className="h-auto w-full justify-start gap-3 rounded-lg p-3 hover:bg-muted"
      >
        {isLoggingOut ? (
          <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
        ) : (
          <LogOut aria-hidden="true" size={20} />
        )}
        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
      </Button>
    </div>
  );
};
