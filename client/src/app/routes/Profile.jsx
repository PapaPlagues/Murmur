import UserProfile from "@/features/profile/UserProfile";
import useAuthStore from "@/stores/authStore";
import { useOutletContext, useParams } from "react-router";
import { useEffect, useState } from "react";

const Profile = () => {
  const { userId } = useParams();
  const { handleStartConversation } = useOutletContext();

  const currentUser = useAuthStore((state) => state.user);

  const [user, setUser] = useState(currentUser);
  const [isLoading, setIsLoading] = useState(!!userId);

  useEffect(() => {
    if (!userId) {
      setUser(currentUser);
      setIsLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${userId}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [userId, currentUser]);

  if (isLoading) {
    return <div>Loading...</div>
  };

  if (!user) {
    return <div>User not found.</div>
  }

  return (
    <UserProfile
     user={user} 
     isOwnProfile={!userId}
     onMessage={handleStartConversation} 
    />
  )
};

export default Profile;
