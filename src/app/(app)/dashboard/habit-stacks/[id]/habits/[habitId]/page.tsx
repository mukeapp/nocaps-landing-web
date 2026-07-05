"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteHabitOnly, GetHabitComponentsByHabitStackId } from "@/lib/api/section-b/habit";
import { GetHabitLinksComponentsByHabitId } from "@/lib/api/section-b/habit-link";
import type { HabitComponent, HabitLinkComponent } from "@/types/section-b/habit";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/dashboard/score-badge";
import { HabitLinkRow } from "@/components/dashboard/habit-link-row";
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

export default function HabitDetailPage() {
  const params = useParams<{ id: string; habitId: string }>();
  const router = useRouter();

  const [habit, setHabit] = useState<HabitComponent | null>(null);
  const [links, setLinks] = useState<HabitLinkComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      GetHabitComponentsByHabitStackId({ id: params.id }),
      GetHabitLinksComponentsByHabitId({ habitId: params.habitId }),
    ])
      .then(([habitsRes, linksRes]) => {
        const found = Array.isArray(habitsRes.data)
          ? habitsRes.data.find(
              (h: HabitComponent) => (h.documentId ?? h.id) === params.habitId,
            )
          : null;
        if (found) {
          setHabit(found);
        } else {
          setError("Unable to load this habit.");
        }
        setLinks(Array.isArray(linksRes.data) ? linksRes.data : []);
      })
      .finally(() => setLoading(false));
  }, [params.id, params.habitId]);

  async function handleDelete() {
    const res = await DeleteHabitOnly({ id: params.habitId });
    if (res.status >= 200 && res.status < 300) {
      toast.success("Habit deleted.");
      router.push(`/dashboard/habit-stacks/${params.id}`);
      router.refresh();
    } else {
      toast.error("Unable to delete habit.");
    }
  }

  return (
    <DataState loading={loading} error={error}>
      {habit ? (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{habit.name}</h1>
              {habit.description ? (
                <p className="mt-1 text-sm text-muted-foreground">{habit.description}</p>
              ) : null}
              <div className="mt-2">
                <ScoreBadge scoreInfo={habit.scoreComponent?.scoreInfo} />
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button asChild variant="outline" size="icon">
                <Link href={`/dashboard/habit-stacks/${params.id}/habits/${params.habitId}/edit`}>
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
                    <AlertDialogTitle>Delete this habit?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently deletes &quot;{habit.name}&quot; and every link and item inside it.
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
            <h2 className="text-lg font-medium">Habit Links</h2>
            <Button asChild size="sm">
              <Link href={`/dashboard/habit-stacks/${params.id}/habits/${params.habitId}/links/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Link
              </Link>
            </Button>
          </div>

          {links.length === 0 ? (
            <div className="flex h-[30vh] items-center justify-center">
              <p className="text-base font-semibold text-white">No Habit Link Found.</p>
            </div>
          ) : (
            links.map((link) => (
              <HabitLinkRow
                key={link.documentId ?? link.id}
                link={link}
                onOpen={(lk) =>
                  router.push(
                    `/dashboard/habit-stacks/${params.id}/habits/${params.habitId}/links/${lk.documentId ?? lk.id}`,
                  )
                }
              />
            ))
          )}
        </div>
      ) : null}
    </DataState>
  );
}
