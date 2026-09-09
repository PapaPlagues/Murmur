import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Ghost } from "lucide-react";
import useAuthStore from "@/stores/authStore";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginUser = useAuthStore((state) => state.login);

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

    setLoading(true);
    setMessage("");

    try {
      await loginUser(formData);

      setMessage("Login successful!");
      navigate("/");
    } catch {
      setMessage("An error occured. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 flex-col">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <FieldSet>
          <div className="mb-6 text-center">
            <div className="flex items-center gap-2 justify-center">
              <Ghost />
              <h1 className="text-2xl font-bold">Murmur</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Welcome back.</p>
          </div>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Johndoe@email.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </Field>
          </FieldGroup>

          <Button className="w-full" type="submit">
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        </FieldSet>
      </form>

      <div className="p-6">{message && <p>{message}</p>}</div>
    </main>
  );
};

export default Login;
