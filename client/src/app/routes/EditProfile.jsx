import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router";
import useUserStore from "@/stores/userStore";

export const EditProfile = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser);
  const updateUser = useUserStore((state) => state.updateUser);

  const updateAvatar = useUserStore((state) => state.updateAvatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);

  const updateBanner = useUserStore((state) => state.updateBanner);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl]);

  useEffect(() => {
    return () => {
      if (bannerPreviewUrl) URL.revokeObjectURL(bannerPreviewUrl);
    };
  }, [bannerPreviewUrl]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0] || null;
    setAvatarFile(file);
    setAvatarPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0] || null;
    setBannerFile(file);
    setBannerPreviewUrl(file ? URL.createObjectURL(file) : null);
  };


  const [formData, setFormData] = useState({
    displayName: user.displayName || "",
    username: user.username || "",
    bio: user.bio || "",
  });

  const handleChange = (e) => {
    const fieldName = e.target.id;
    const newValue = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setSaveError("");

    try {
      let updatedUser = await updateUser(formData);

      if (avatarFile) {
        updatedUser = await updateAvatar(avatarFile);
      }

      if (bannerFile) {
        updatedUser = await updateBanner(bannerFile);
      }

      setUser(updatedUser);
      navigate("/profile");
    } catch (error) {
      setSaveError(error.message || "Unable to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="murmur-scrollbar flex flex-1 justify-center overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
      <form onSubmit={handleSubmit} className="my-auto w-full max-w-3xl">
        <Card className="w-full border-border/80 shadow-sm">
          <CardHeader className="border-b border-border/70 px-5 py-5 sm:px-8">
            <CardTitle className="text-xl font-semibold">Edit Profile</CardTitle>
            <p className="text-sm text-muted-foreground">
              Update the details people see on your profile.
            </p>
          </CardHeader>

          <CardContent className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
            {/* Banner */}
            <section className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold">Profile images</h2>
                <p className="text-sm text-muted-foreground">
                  Choose a banner and picture that represent you.
                </p>
              </div>

              <div className="aspect-7/2 max-h-56 min-h-28 w-full overflow-hidden rounded-lg border border-border/70 bg-muted sm:min-h-36">
                <img
                  src={bannerPreviewUrl || user?.banner || "/assets/banner-fallback.svg"}
                  alt="Banner preview"
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    if (event.currentTarget.src.endsWith("/assets/banner-fallback.svg")) {
                      event.currentTarget.removeAttribute("src");
                    } else {
                      event.currentTarget.src = "/assets/banner-fallback.svg";
                    }
                  }}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] sm:items-center">
                <div className="flex items-center gap-4">
                  <Avatar className="size-20 shrink-0 ring-4 ring-background sm:size-24">
                    <AvatarImage
                      src={avatarPreviewUrl || user?.avatar || undefined}
                      alt={`${user?.username}'s profile preview`}
                    />
                    <AvatarFallback className="text-xl font-semibold">
                      {user?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Profile picture</p>
                    <p className="mt-1 text-xs text-muted-foreground">Square images work best.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banner">Banner image</Label>
                  <Input
                  id="banner"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="h-auto min-h-10 cursor-pointer py-2 file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-xs file:font-medium"
                  />
                </div>
                <div className="space-y-2 sm:col-start-2">
                  <Label htmlFor="avatar">Profile picture</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="h-auto min-h-10 cursor-pointer py-2 file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-xs file:font-medium"
                  />
                </div>
              </div>
            </section>

            {/* Display name */}
            <section className="space-y-5 border-t border-border/70 pt-6">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold">Profile details</h2>
                <p className="text-sm text-muted-foreground">
                  Keep your name and bio recognizable to friends.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    onChange={handleChange}
                    value={formData.username}
                    placeholder="Your username"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    placeholder="Tell people a little about yourself..."
                    className="min-h-32 resize-y"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* Actions */}
            {saveError && (
              <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {saveError}
              </p>
            )}
            <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-5 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/profile")} disabled={isSaving}>
                Cancel
              </Button>

              <Button type="submit" className="w-full sm:w-auto" disabled={isSaving}>
                {isSaving && <LoaderCircle aria-hidden="true" className="animate-spin" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  );
};
