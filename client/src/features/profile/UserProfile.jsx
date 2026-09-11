import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";

const UserProfile = ({ user, isOwnProfile = false, onMessage }) => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-1 justify-center overflow-y-auto bg-background">
        <div className="w-full max-w-6xl">

          {/* Banner */}
          <div className="relative h-48 w-full bg-muted">
            <img 
            src={user?.banner || "https://placehold.co/1200x300"} 
            alt=""
            className="h-full w-full object-cover" 
            />

            {/* Avatar */}
            <div className="absolute -bottom-16 left-8">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage 
                  src={user?.avatar || "https://github.com/shadcn.png"}
                  alt={user?.username}
                />
                <AvatarFallback>
                  {user?.username?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Profile info */}
          <div className="px-8 pt-20">

            {/* Top row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">
                  {user?.displayName || user?.username}
                </h1>

                <p className="text-muted-foreground">
                  @{user?.username}
                </p>
              </div>

              {isOwnProfile ? (
                  <Button variant="outline" onClick={() => navigate("/profile/edit")}>
                    Edit Profile
                  </Button>
              ) : (
                <Button onClick={() => onMessage(user)}>
                  Send Message
                </Button>
              )}
            </div>

            {/* Details */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* About */}
            <Card className="mt-8 p-6">
              <h2 className="text-lg font-semibold">
                About
              </h2>


              <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                {user?.bio || "This user hasn't added anything about themselves yet." }
              </p>

            </Card>

          </div>
        </div>
    </main>
  )
};

export default UserProfile;
