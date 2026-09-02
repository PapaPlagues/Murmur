import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Ghost } from "lucide-react";


const Register = () => {
  return (
    <>
      <main className="flex min-h-screen items-center justify-center px-4"> 
        <form action="" className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-sm">
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
                type="text"
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
                type="text"
                placeholder="John Doe"
              />
              <FieldDescription>
                This is the name other users will see.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@email.com"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
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
                type="password"
                placeholder="••••••••"
              />
            </Field>
          </FieldGroup>

          <Button className="w-full" type="submit">Create Account</Button>
        

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </FieldSet>
        </form>
      </main>
    </>
  );
};

export default Register;
