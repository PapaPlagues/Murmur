import useAuthStore from "@/stores/authStore";
import ResourceState from "@/components/ResourceState";
import { Ghost } from "lucide-react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <ResourceState
          icon={Ghost}
          title="Restoring your session"
          description="Just a moment."
          loading
          className="w-full"
        />
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
