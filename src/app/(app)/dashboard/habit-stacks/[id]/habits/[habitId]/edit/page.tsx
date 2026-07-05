"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GetHabitComponentsByHabitStackId } from "@/lib/api/section-b/habit";
import type { HabitComponent } from "@/types/section-b/habit";
import { HabitForm } from "@/components/dashboard/habit-form";
import { DataState } from "@/components/dashboard/data-state";

export default function EditHabitPage() {
  const params = useParams<{ id: string; habitId: string }>();
  const [habit, setHabit] = useState<HabitComponent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    GetHabitComponentsByHabitStackId({ id: params.id })
      .then((res) => {
        const found = Array.isArray(res.data)
          ? res.data.find((h: HabitComponent) => (h.documentId ?? h.id) === params.habitId)
          : null;
        if (found) {
          setHabit(found);
        } else {
          setError("Unable to load this habit.");
        }
      })
      .finally(() => setLoading(false));
  }, [params.id, params.habitId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Habit</h1>
      </div>
      <DataState loading={loading} error={error}>
        {habit ? <HabitForm habitStackId={params.id} habit={habit} /> : null}
      </DataState>
    </div>
  );
}
