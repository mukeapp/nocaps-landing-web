"use client";

import { useParams } from "next/navigation";
import { HabitLinkForm } from "@/components/dashboard/habit-link-form";

export default function NewHabitLinkPage() {
  const params = useParams<{ id: string; habitId: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add Habit Link</h1>
      </div>
      <HabitLinkForm habitStackId={params.id} habitId={params.habitId} />
    </div>
  );
}
