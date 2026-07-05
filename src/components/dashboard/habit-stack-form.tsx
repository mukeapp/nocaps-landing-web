"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { GetAllSectorComponents, SaveHabitStack, UpdateHabitStack } from "@/lib/api/section-b/habit-stack";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Sector {
  id: string;
  name: string;
}

export function HabitStackForm({ stack }: { stack?: HabitStackComponent }) {
  const router = useRouter();
  const userId = useCurrentUserId();
  const isEditing = Boolean(stack);

  const [name, setName] = useState(stack?.name ?? "");
  const [description, setDescription] = useState(stack?.description ?? "");
  const [sectorId, setSectorId] = useState(stack?.sectorId ?? "");
  const [isPublic, setIsPublic] = useState(stack?.isPublic ?? false);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    GetAllSectorComponents().then((res) => {
      if (Array.isArray(res.data)) setSectors(res.data);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Give your habit stack a name.");
      return;
    }

    setSaving(true);
    try {
      if (isEditing && stack) {
        const res = await UpdateHabitStack({
          data: { ...stack, id: stack.documentId ?? stack.id, name, description, sectorId, isPublic },
        });
        if (res.status >= 200 && res.status < 300) {
          toast.success("Habit stack updated.");
          router.push(`/dashboard/habit-stacks/${stack.documentId ?? stack.id}`);
          router.refresh();
        } else {
          toast.error("Unable to update habit stack.");
        }
      } else {
        const res = await SaveHabitStack({
          data: { userId, name, description, sectorId, isPublic, searchName: name.toLowerCase(), status: "PLAY" },
        });
        if (res.status >= 200 && res.status < 300) {
          toast.success("Habit stack created.");
          router.push("/dashboard/habit-stacks");
          router.refresh();
        } else {
          toast.error("Unable to create habit stack.");
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
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>
      {sectors.length > 0 ? (
        <div className="space-y-2">
          <Label>Sector</Label>
          <Select value={sectorId} onValueChange={setSectorId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a sector" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      <div className="flex items-center gap-2">
        <Checkbox id="isPublic" checked={isPublic} onCheckedChange={(v) => setIsPublic(v === true)} />
        <Label htmlFor="isPublic" className="font-normal text-muted-foreground">
          Make this habit stack public in the Habit Market
        </Label>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEditing ? "Save changes" : "Create habit stack"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
