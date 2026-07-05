"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DeleteHabitStack,
  GetHabitStackByDocumentId,
} from "@/lib/api/section-b/habit-stack";
import { GetHabitComponentsByHabitStackId } from "@/lib/api/section-b/habit";
import type { HabitComponent, HabitStackComponent } from "@/types/section-b/habit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/dashboard/score-badge";
import { DataState } from "@/components/dashboard/data-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HabitStackDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [stack, setStack] = useState<HabitStackComponent | null>(null);
  const [habits, setHabits] = useState<HabitComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      GetHabitStackByDocumentId({ id: params.id }),
      GetHabitComponentsByHabitStackId({ id: params.id }),
    ])
      .then(([stackRes, habitsRes]) => {
        if (stackRes.status >= 200 && stackRes.status < 300 && stackRes.data) {
          setStack(stackRes.data as HabitStackComponent);
        } else {
          setError("Unable to load this habit stack.");
        }
        setHabits(Array.isArray(habitsRes.data) ? habitsRes.data : []);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleDelete() {
    const res = await DeleteHabitStack({ id: params.id });
    if (res.status >= 200 && res.status < 300) {
      toast.success("Habit stack deleted.");
      router.push("/dashboard/habit-stacks");
      router.refresh();
    } else {
      toast.error("Unable to delete habit stack.");
    }
  }

  return (
    <DataState loading={loading} error={error}>
      {stack ? (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">{stack.name}</h1>
                {stack.status ? (
                  <Badge variant="secondary" className="capitalize">
                    {stack.status.toLowerCase()}
                  </Badge>
                ) : null}
              </div>
              {stack.description ? (
                <p className="mt-1 text-sm text-muted-foreground">{stack.description}</p>
              ) : null}
              <div className="mt-2">
                <ScoreBadge scoreInfo={stack.scoreComponent?.scoreInfo} />
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button asChild variant="outline" size="icon">
                <Link href={`/dashboard/habit-stacks/${params.id}/edit`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this habit stack?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently deletes &quot;{stack.name}&quot; and every habit, link and item inside it.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Habits</h2>
            <Button asChild size="sm">
              <Link href={`/dashboard/habit-stacks/${params.id}/habits/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Habit
              </Link>
            </Button>
          </div>

          <DataState loading={false} error={null} empty={habits.length === 0} emptyMessage="No habits in this stack yet.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {habits.map((habit) => (
                <Link
                  key={habit.documentId ?? habit.id}
                  href={`/dashboard/habit-stacks/${params.id}/habits/${habit.documentId ?? habit.id}`}
                >
                  <Card className="h-full transition-colors hover:bg-accent/50">
                    <CardHeader>
                      <CardTitle className="text-base">{habit.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {habit.description ? (
                        <p className="line-clamp-2 text-sm text-muted-foreground">{habit.description}</p>
                      ) : null}
                      <ScoreBadge scoreInfo={habit.scoreComponent?.scoreInfo} />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </DataState>
        </div>
      ) : null}
    </DataState>
  );
}
