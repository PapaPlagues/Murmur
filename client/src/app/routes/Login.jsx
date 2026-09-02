import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Login = () => {
    return(
        <>
            <main className="flex min-h-screen items-center justify-center px-4">
                 <form action="" className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
                <FieldSet>
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold">Murmur</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Welcome back.
                        </p>
                    </div>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input id="email" type="email" placeholder="Johndoe@email.com" />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input id="password" type="password" placeholder="••••••••" />
                        </Field>
                    </FieldGroup>

                    <Button className="w-full" type="submit">Login</Button>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-primary hover:underline">Register</Link>
                        </p>
                    </div>
                </FieldSet>
                </form>            
            </main>
        </>
    )
};

export default Login;