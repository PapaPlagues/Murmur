import UserProfile from "@/features/profile/UserProfile";
import useAuthStore from "@/stores/authStore";

const Profile = () => {
  const user = useAuthStore((state) => state.user);

  return <UserProfile user={user} isOwnProfile />;
};

export default Profile;