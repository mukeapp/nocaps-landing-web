"use client";

import { useParams } from "next/navigation";
import { HabitForm } from "@/components/dashboard/habit-form";

export default function NewHabitPage() {
  const params = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add Habit</h1>
      </div>
      <HabitForm habitStackId={params.id} />
    </div>
  );
}
