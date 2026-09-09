const UserProfile = ({ user, isOwnProfile = false, onMessage }) => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <div className="text-center">
        <img
          src={user?.avatar || "https://github.com/shadcn.png"}
          alt={`${user?.username}'s profile`}
          className="mx-auto h-24 w-24 rounded-full"
        />

        <h1 className="mt-4 text-xl font-semibold">
          {user?.displayName || user?.username}
        </h1>

        <p className="text-muted-foreground">@{user?.username}</p>

        <p className="mt-4">{user?.bio || "Just another person on Murmur."}</p>

        {isOwnProfile ? (
          <button className="mt-6 rounded-md border px-4 py-2">
            Edit Profile
          </button>
        ) : (
          <button
            className="mt-6 rounded-md border px-4 py-2"
            onClick={() => onMessage(user)}
          >
            Send Message
          </button>
        )}
      </div>
    </main>
  );
};

export default UserProfile;
