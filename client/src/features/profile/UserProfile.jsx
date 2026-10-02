import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { isUserOnline } from "@/utils/presence";
import { useNavigate } from "react-router";
import { LoaderCircle, Send } from "lucide-react";
import { useState } from "react";

const UserProfile = ({ user, isOwnProfile = false, onMessage }) => {
  const navigate = useNavigate();
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  const [messageError, setMessageError] = useState("");

  const handleMessage = async () => {
    if (isStartingConversation || !onMessage) return;

    setIsStartingConversation(true);
    setMessageError("");
    try {
      await onMessage(user);
    } catch (error) {
      setMessageError(error.message || "Unable to start a conversation.");
    } finally {
      setIsStartingConversation(false);
    }
  };

  if (!user) {
    return null;
  }

  const online = isUserOnline(user?.lastSeenAt);
  const createdAt = user?.createdAt == null ? null : new Date(user.createdAt);
  const joinedDate =
    createdAt && Number.isFinite(createdAt.getTime())
      ? createdAt.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : null;

  return (
    <main className="murmur-scrollbar flex flex-1 justify-center overflow-y-auto bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="w-full max-w-5xl">
        <div className="relative">
          {/* Banner */}
          <div className="aspect-3.5/1 max-h-64 min-h-36 w-full overflow-hidden rounded-t-xl bg-muted sm:min-h-48">
            <img
              src={user?.banner || "/assets/banner-fallback.svg"}
              alt=""
              className="h-full w-full object-cover"
              onError={(event) => {
                if (
                  event.currentTarget.src.endsWith(
                    "/assets/banner-fallback.svg",
                  )
                ) {
                  event.currentTarget.removeAttribute("src");
                } else {
                  event.currentTarget.src = "/assets/banner-fallback.svg";
                }
              }}
            />
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-12 left-4 sm:-bottom-16 sm:left-8">
            <Avatar className="size-24 border-4 border-background shadow-sm sm:size-32">
              <AvatarImage
                src={user?.avatar || undefined}
                alt={user?.username}
              />
              <AvatarFallback>
                {user?.username?.[0]?.toUpperCase()}
              </AvatarFallback>

              <AvatarBadge
                className={
                  online
                    ? "bg-green-600 dark:bg-green-800"
                    : "bg-muted-foreground"
                }
                aria-label={online ? "Online" : "Offline"}
              />
            </Avatar>
          </div>
        </div>

        {/* Profile info */}
        <div className="mx-auto max-w-4xl px-2 pt-16 sm:px-8 sm:pt-20">
          {/* Top row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="wrap-break-word text-2xl font-bold leading-tight sm:text-3xl">
                {user?.displayName || user?.username}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                @{user?.username}
              </p>
            </div>

            {isOwnProfile ? (
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => navigate("/profile/edit")}
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                className="w-full sm:w-auto"
                onClick={handleMessage}
                disabled={isStartingConversation}
              >
                {isStartingConversation ? (
                  <LoaderCircle aria-hidden="true" className="animate-spin" />
                ) : (
                  <Send aria-hidden="true" />
                )}
                {isStartingConversation ? "Starting..." : "Send Message"}
              </Button>
            )}
          </div>

          {messageError && (
            <p
              role="alert"
              className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {messageError}
            </p>
          )}

          {/* Details */}
          {joinedDate && (
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border/70 pb-6 text-sm text-muted-foreground">
              <span className="font-medium text-foreground/80">
                Joined {joinedDate}
              </span>
            </div>
          )}

          {/* About */}
          <section className="py-6 sm:py-8">
            <h2 className="text-base font-semibold">About</h2>

            <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {user?.bio ||
                "This user hasn't added anything about themselves yet."}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
