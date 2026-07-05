"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid a hydration mismatch: theme is unknown on the server.
  useEffect(() => setMounted(true), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Choose how NoCap looks on this device.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={mounted ? theme : undefined}
          onValueChange={setTheme}
          className="grid grid-cols-3 gap-3"
        >
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            const active = mounted && theme === option.value;
            return (
              <Label
                key={option.value}
                htmlFor={`theme-${option.value}`}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors",
                  active ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent",
                )}
              >
                <RadioGroupItem value={option.value} id={`theme-${option.value}`} className="sr-only" />
                <Icon className="h-5 w-5" />
                {option.label}
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
