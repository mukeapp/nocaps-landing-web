import { HabitStackForm } from "@/components/dashboard/habit-stack-form";

export default function NewHabitStackPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Habit Stack</h1>
        <p className="text-sm text-muted-foreground">Group related habits together.</p>
      </div>
      <HabitStackForm />
    </div>
  );
}
