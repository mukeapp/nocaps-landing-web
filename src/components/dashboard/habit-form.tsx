"use client";

import { mobileInput } from "@/components/dashboard/form-styles";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SaveHabitRequest, UpdateHabitRequest } from "@/lib/api/section-b/habit";
import type { HabitComponent, HabitStatus } from "@/types/section-b/habit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_OPTIONS: HabitStatus[] = ["PLAY", "PAUSE", "STOP"];

export function HabitForm({ habitStackId, habit }: { habitStackId: string; habit?: HabitComponent }) {
  const router = useRouter();
  const isEditing = Boolean(habit);

  const [name, setName] = useState(habit?.name ?? "");
  const [description, setDescription] = useState(habit?.description ?? "");
  const [frequency, setFrequency] = useState(habit?.frequency ?? "Daily");
  const [status, setStatus] = useState<HabitStatus>(habit?.status ?? "PLAY");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Give this habit a name.");
      return;
    }

    setSaving(true);
    try {
      if (isEditing && habit) {
        const res = await UpdateHabitRequest({
          data: { ...habit, id: habit.documentId ?? habit.id, name, description, frequency, status },
        });
        if (res.status >= 200 && res.status < 300) {
          toast.success("Habit updated.");
          router.push(`/dashboard/habit-stacks/${habitStackId}/habits/${habit.documentId ?? habit.id}`);
          router.refresh();
        } else {
          toast.error("Unable to update habit.");
        }
      } else {
        const res = await SaveHabitRequest({ data: { habitStackId, name, description, frequency, status } });
        if (res.status >= 200 && res.status < 300) {
          toast.success("Habit added.");
          router.push(`/dashboard/habit-stacks/${habitStackId}`);
          router.refresh();
        } else {
          toast.error("Unable to add habit.");
        }
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input className={mobileInput} id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea className={mobileInput} id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Input className={mobileInput} id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as HabitStatus)}>
            <SelectTrigger className={mobileInput}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option} className="capitalize">
                  {option.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEditing ? "Save changes" : "Add habit"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
