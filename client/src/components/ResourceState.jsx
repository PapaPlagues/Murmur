import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoaderCircle, RotateCw } from "lucide-react";

const ResourceState = ({
  icon: Icon,
  title,
  description,
  loading = false,
  error = false,
  actionLabel,
  onAction,
  className = "",
}) => {
  const StateIcon = loading ? LoaderCircle : Icon;

  return (
    <div
      role={error ? "alert" : "status"}
      aria-live={error ? "assertive" : "polite"}
      className={`flex items-center justify-center p-4 ${className}`}
    >
      <Card
        className={`w-full max-w-sm border-border/70 bg-card/70 p-6 text-center shadow-none ${
          error ? "border-destructive/30" : ""
        }`}
      >
        <StateIcon
          aria-hidden="true"
          className={`mx-auto size-6 ${
            loading
              ? "animate-spin text-muted-foreground"
              : error
                ? "text-destructive"
                : "text-primary"
          }`}
        />
        <h2 className="mt-3 text-sm font-semibold">{title}</h2>
        <p className={`mt-1 text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}>
          {description}
        </p>
        {actionLabel && onAction && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={onAction}
          >
            <RotateCw aria-hidden="true" />
            {actionLabel}
          </Button>
        )}
      </Card>
    </div>
  );
};

export default ResourceState;