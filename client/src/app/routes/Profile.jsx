import useAuthStore from "@/stores/authStore";

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  console.log(user);

  return (
    <main>
      <h1>Profile</h1>

      <div>
        <img src="https://github.com/shadcn.png" alt="Profile" />
      </div>

      <p>{user?.username}</p>
      <p>{user?.displayName ?? ""}</p>
      <p>Just another person on Murmur.</p>
      <p>johndoe@email.com</p>
    </main>
  );
};

export default Profile;