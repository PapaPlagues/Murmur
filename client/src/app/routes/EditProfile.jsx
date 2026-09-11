import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router";
import useUserStore from "@/stores/userStore";

export const EditProfile = () => {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    const setUser = useAuthStore((state) => state.setUser);
    const updateUser = useUserStore((state) => state.updateUser);

    const [formData, setFormData] = useState({
        displayName: user.displayName || '',
        username: user.username || '',
        bio: user.bio || '',
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
        console.log('Submitted Data:', formData);

        const updatedUser = await updateUser(formData);
        setUser(updatedUser);

        navigate("/profile");
    }

    return (
        <main className="flex flex-1 justify-center overflow-y-auto p-8 items-center ">
            <form onSubmit={handleSubmit}>

            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>

                <CardContent className="space-y-8">

                    {/* Profile picture */}
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                                src={user?.avatar}
                                alt={user?.username}
                            />
                            <AvatarFallback>
                                {user?.username?.[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2">
                            <Label htmlFor="avatar">Profile Picture</Label>
                            <Input 
                                id="avatar"
                                type="file" 
                                accept="image/*" 
                            />
                        </div>
                    </div>

                    {/* Display name */}
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input 
                            id="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            placeholder="Your display name"
                        />
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                            id="username"
                            onChange={handleChange}
                            value={formData.username}
                            placeholder="Your username"
                        />
                    </div>

                    {/* Bio */}
                    <div className="flex justify-end gap-3">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                            id="bio"
                            value={formData.bio}
                            placeholder="Tell people a little about yourself..."
                            className="min-h-32 resize-none"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 py-4">
                        <Button variant="outline" onClick={() => navigate("/profile")}>
                            Cancel
                        </Button>

                        <Button type="submit">
                            Save Changes
                        </Button>
                    </div>


                </CardContent>

            </Card>
            </form>
        </main>
    )
}