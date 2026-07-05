"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
import { HabitCard } from "@/components/dashboard/habit-card";
import { ScoreDial } from "@/components/dashboard/score-dial";
import { StatusIcon } from "@/components/dashboard/status-icon";
import { DataState } from "@/components/dashboard/data-state";
import { withOpacity } from "@/lib/score-colors";
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
        <div className="mx-auto max-w-xl">
          {/* Stack header — mirrors the HabitStackCard header treatment */}
          <div
            className="rounded-xl bg-[rgba(25,25,25,1)] p-3"
            style={{ border: `1px solid ${withOpacity(stack.iconColor, 0.5)}` }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: withOpacity(stack.iconColor, 0.2) }}
              >
                <Image
                  src={stack.icon?.startsWith("http") ? stack.icon : "/assets/images/dollar.png"}
                  alt=""
                  width={30}
                  height={30}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h1 className="truncate text-[16px] font-semibold text-white">{stack.name}</h1>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button asChild variant="outline" size="iconx">
                      <Link href={`/dashboard/habit-stacks/${params.id}/edit`}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="iconx">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this habit stack?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This permanently deletes &quot;{stack.name}&quot; and every habit, link and item inside
                            it.
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
                {stack.description ? (
                  <p className="mt-1 text-sm text-white/50">{stack.description}</p>
                ) : null}
                <div className="mt-2 flex items-center gap-1.5">
                  <StatusIcon status={stack.status} />
                </div>
              </div>
              <ScoreDial score={stack.scoreComponent?.score} scoreInfo={stack.scoreComponent?.scoreInfo} size={50} />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-white">Habits</h2>
            <Button asChild size="sm">
              <Link href={`/dashboard/habit-stacks/${params.id}/habits/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Habit
              </Link>
            </Button>
          </div>

          {habits.length === 0 ? (
            <div className="flex h-[30vh] items-center justify-center">
              <p className="text-base font-semibold text-white">No Habit Found.</p>
            </div>
          ) : (
            habits.map((habit) => {
              const habitId = habit.documentId ?? habit.id;
              return (
                <HabitCard
                  key={habitId}
                  habit={habit}
                  editHref={`/dashboard/habit-stacks/${params.id}/habits/${habitId}/edit`}
                  onOpenLink={(linkId) =>
                    router.push(`/dashboard/habit-stacks/${params.id}/habits/${habitId}/links/${linkId}`)
                  }
                  defaultExpanded
                />
              );
            })
          )}
        </div>
      ) : null}
    </DataState>
  );
}
