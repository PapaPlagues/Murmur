import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ghost, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <Card className="w-full max-w-md border-border/80 bg-card p-8 text-center shadow-sm">
        <Ghost aria-hidden="true" className="mx-auto size-8 text-primary" />
        <p className="mt-5 text-sm font-medium text-muted-foreground">Murmur</p>
        <h1 className="mt-2 text-5xl font-bold">404</h1>
        <h2 className="mt-3 text-lg font-semibold">This page can't be found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The link may be outdated, or the page may have moved.
        </p>
        <Button type="button" className="mt-6" onClick={() => navigate("/")}>
          <MessageSquare aria-hidden="true" />
          Back to Murmur
        </Button>
      </Card>
    </main>
  );
};

export default NotFound;
