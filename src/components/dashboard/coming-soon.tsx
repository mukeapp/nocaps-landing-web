import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ComingSoon({ feature }: { feature: string }) {
  return (
    <Card className="mx-auto mt-12 max-w-md">
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <Construction className="h-8 w-8 text-muted-foreground" />
        <h2 className="text-lg font-semibold">{feature}</h2>
        <p className="text-sm text-muted-foreground">
          This is on the roadmap for the web app and isn&apos;t available here yet.
        </p>
      </CardContent>
    </Card>
  );
}
