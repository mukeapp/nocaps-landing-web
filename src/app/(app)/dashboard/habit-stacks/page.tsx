"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { getHabitStackComponentsByUserId } from "@/lib/api/section-b/habit-stack";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/dashboard/score-badge";
import { DataState } from "@/components/dashboard/data-state";

export default function HabitStacksPage() {
  const userId = useCurrentUserId();
  const [stacks, setStacks] = useState<HabitStackComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getHabitStackComponentsByUserId({ id: userId })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          setStacks(Array.isArray(res.data) ? res.data : []);
          setError(null);
        } else {
          setError("Unable to load your habit stacks.");
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Habit Stacks</h1>
          <p className="text-sm text-muted-foreground">
            Organize the habits, links and items you&apos;re tracking.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/habit-stacks/new">
            <Plus className="mr-2 h-4 w-4" />
            New Habit Stack
          </Link>
        </Button>
      </div>

      <DataState
        loading={loading || !userId}
        error={error}
        empty={stacks.length === 0}
        emptyMessage="You don't have any habit stacks yet. Create your first one to get started."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stacks.map((stack) => (
            <Link key={stack.documentId ?? stack.id} href={`/dashboard/habit-stacks/${stack.documentId ?? stack.id}`}>
              <Card className="h-full transition-colors hover:bg-accent/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{stack.name}</CardTitle>
                    {stack.status ? (
                      <Badge variant="secondary" className="shrink-0 capitalize">
                        {stack.status.toLowerCase()}
                      </Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stack.description ? (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{stack.description}</p>
                  ) : null}
                  <ScoreBadge scoreInfo={stack.scoreComponent?.scoreInfo} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </DataState>
    </div>
  );
}
