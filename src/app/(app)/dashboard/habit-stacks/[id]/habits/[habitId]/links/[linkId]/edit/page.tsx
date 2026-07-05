"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GetHabitLinksComponentsByHabitId } from "@/lib/api/section-b/habit-link";
import type { HabitLinkComponent } from "@/types/section-b/habit";
import { HabitLinkForm } from "@/components/dashboard/habit-link-form";
import { DataState } from "@/components/dashboard/data-state";

export default function EditHabitLinkPage() {
  const params = useParams<{ id: string; habitId: string; linkId: string }>();
  const [link, setLink] = useState<HabitLinkComponent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    GetHabitLinksComponentsByHabitId({ habitId: params.habitId })
      .then((res) => {
        const found = Array.isArray(res.data)
          ? res.data.find((l: HabitLinkComponent) => (l.documentId ?? l.id) === params.linkId)
          : null;
        if (found) {
          setLink(found);
        } else {
          setError("Unable to load this habit link.");
        }
      })
      .finally(() => setLoading(false));
  }, [params.habitId, params.linkId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Habit Link</h1>
      </div>
      <DataState loading={loading} error={error}>
        {link ? <HabitLinkForm habitStackId={params.id} habitId={params.habitId} link={link} /> : null}
      </DataState>
    </div>
  );
}
