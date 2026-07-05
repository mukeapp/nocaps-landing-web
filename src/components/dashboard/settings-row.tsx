import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";

export function SettingsRow({
  icon: Icon,
  label,
  href,
  external,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center justify-between rounded-lg bg-card px-4 py-3 transition-colors hover:bg-accent"
    >
      <span className="flex items-center gap-3 text-sm font-medium">
        <Icon className="h-5 w-5 text-muted-foreground" />
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
