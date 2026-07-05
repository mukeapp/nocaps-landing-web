"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SaveHabitLinks, UpdateHabitLinks } from "@/lib/api/section-b/habit-link";
import type { HabitLinkComponent } from "@/types/section-b/habit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function HabitLinkForm({
  habitStackId,
  habitId,
  link,
}: {
  habitStackId: string;
  habitId: string;
  link?: HabitLinkComponent;
}) {
  const router = useRouter();
  const isEditing = Boolean(link);

  const [name, setName] = useState(link?.name ?? "");
  const [description, setDescription] = useState(link?.description ?? "");
  const [company, setCompany] = useState(link?.company ?? "");
  const [location, setLocation] = useState(link?.location ?? "");
  const [saving, setSaving] = useState(false);

  const detailHref = `/dashboard/habit-stacks/${habitStackId}/habits/${habitId}/links/${link?.documentId ?? link?.id}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Give this link a name.");
      return;
    }

    setSaving(true);
    try {
      if (isEditing && link) {
        const res = await UpdateHabitLinks({
          docid: link.documentId ?? link.id ?? "",
          data: { ...link, name, description, company, location },
        });
        if (res.status >= 200 && res.status < 300) {
          toast.success("Habit link updated.");
          router.push(detailHref);
          router.refresh();
        } else {
          toast.error("Unable to update habit link.");
        }
      } else {
        const res = await SaveHabitLinks({ data: { habitId, name, description, company, location } });
        if (res.status >= 200 && res.status < 300) {
          toast.success("Habit link added.");
          router.push(`/dashboard/habit-stacks/${habitStackId}/habits/${habitId}`);
          router.refresh();
        } else {
          toast.error("Unable to add habit link.");
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
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEditing ? "Save changes" : "Add link"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
