import UserProfile from "@/features/profile/UserProfile";
import { getUser as getUserApi } from "@/api/users";
import ResourceState from "@/components/ResourceState";
import useAuthStore from "@/stores/authStore";
import { useOutletContext, useParams } from "react-router";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

const Profile = () => {
  const { userId } = useParams();
  const { handleStartConversation } = useOutletContext();

  const currentUser = useAuthStore((state) => state.user);

  const [profileState, setProfileState] = useState({
    userId: null,
    retryCount: -1,
    status: "idle",
    user: null,
    error: null,
  });
  const [retryCount, setRetryCount] = useState(0);

  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    if (!userId) {
      return;
    }

    let active = true;

    const loadUser = async () => {
      try {
        const user = await getUserApi(userId);
        if (active) {
          setProfileState({
            userId,
            retryCount,
            status: "ready",
            user,
            error: null,
          });
        }
      } catch (error) {
        if (active) {
          setProfileState({
            userId,
            retryCount,
            status: error.status === 404 ? "not-found" : "error",
            user: null,
            error: error.message || "Unable to load this profile.",
          });
        }
      }
    };

    loadUser();
    return () => {
      active = false;
    };
  }, [userId, retryCount]);

  const isCurrentProfile =
    profileState.userId === userId && profileState.retryCount === retryCount;
  const status = userId
    ? isCurrentProfile
      ? profileState.status
      : "loading"
    : "ready";
  const user = userId ? profileState.user : currentUser;

  if (status === "idle" || status === "loading") {
    return (
      <ResourceState
        icon={UserRound}
        title="Loading profile"
        description="Getting profile details."
        loading
        className="min-h-0 flex-1"
      />
    );
  }

  if (status === "not-found") {
    return (
      <ResourceState
        icon={UserRound}
        title="Profile not found"
        description="This profile may have been removed or the address may be incorrect."
        error
        className="min-h-0 flex-1"
      />
    );
  }

  if (status === "error") {
    return (
      <ResourceState
        icon={UserRound}
        title="Profile couldn’t load"
        description={profileState.error || "Check your connection and try again."}
        error
        actionLabel="Retry"
        onAction={() => setRetryCount((count) => count + 1)}
        className="min-h-0 flex-1"
      />
    );
  }

  if (!user) {
    return (
      <ResourceState
        icon={UserRound}
        title="Profile unavailable"
        description="Your profile details are not available right now."
        error
        className="min-h-0 flex-1"
      />
    );
  }

  return (
    <UserProfile
      user={user}
      isOwnProfile={isOwnProfile}
      onMessage={handleStartConversation}
    />
  );
};

export default Profile;
