import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { Ghost } from "lucide-react";
import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Update state when input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission and API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageIsError(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            displayName: formData.displayName,
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
        navigate("/login");
      } else {
        setMessage(data.error || data.message || "Registration failed.");
        setMessageIsError(true);
      }
    } catch {
      setMessage("An error occurred. Please try again.");
      setMessageIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 flex-col">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <FieldSet>
          <div className="mb-6 text-center">
            <div className="flex items-center gap-2 justify-center">
              <Ghost />
              <h1 className="text-2xl font-bold">Murmur</h1>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Connect. Chat. Murmur.
            </p>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                required
              />
              <FieldDescription>
                Choose a unique username for your account.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="displayName">Display Name</FieldLabel>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
              <FieldDescription>
                This is the name other users will see.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="johndoe@email.com"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </Field>
          </FieldGroup>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Create Account"}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </FieldSet>
      </form>

      <div className="p-6">
        {message && (
          <p
            role={messageIsError ? "alert" : "status"}
            className={`text-center text-sm ${messageIsError ? "text-destructive" : "text-muted-foreground"}`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
};

export default Register;
