import { Loader2 } from "lucide-react";

export function DataState({
  loading,
  error,
  empty,
  emptyMessage = "Nothing here yet.",
  children,
}: {
  loading: boolean;
  error: string | null;
  empty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return <>{children}</>;
}
