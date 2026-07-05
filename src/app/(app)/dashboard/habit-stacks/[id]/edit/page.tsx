"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GetHabitStackByDocumentId } from "@/lib/api/section-b/habit-stack";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { HabitStackForm } from "@/components/dashboard/habit-stack-form";
import { DataState } from "@/components/dashboard/data-state";

export default function EditHabitStackPage() {
  const params = useParams<{ id: string }>();
  const [stack, setStack] = useState<HabitStackComponent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    GetHabitStackByDocumentId({ id: params.id })
      .then((res) => {
        if (res.status >= 200 && res.status < 300 && res.data) {
          setStack(res.data as HabitStackComponent);
        } else {
          setError("Unable to load this habit stack.");
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Habit Stack</h1>
      </div>
      <DataState loading={loading} error={error}>
        {stack ? <HabitStackForm stack={stack} /> : null}
      </DataState>
    </div>
  );
}
