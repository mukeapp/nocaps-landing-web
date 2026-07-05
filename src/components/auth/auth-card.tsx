import Link from "next/link";
import Icons from "@/components/global/icons";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-8 shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8" />
        </Link>
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {children}
      {footer ? <div className="text-center text-sm text-muted-foreground">{footer}</div> : null}
    </div>
  );
}
