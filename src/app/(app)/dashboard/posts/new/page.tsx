"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { CreateNocapPost } from "@/lib/api/section-c/posts";
import {
  GetAllSectorComponents,
  fetchHabitStackComponentsByUserAndSector,
} from "@/lib/api/section-b/habit-stack";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const inputClass =
  "w-full rounded-lg border border-[#3A3A3A] bg-[rgba(41,41,41,1)] px-3 py-2.5 text-[14px] text-white placeholder:text-white/40 outline-none focus:border-[rgba(45,156,219,1)]";

const VISIBILITY_OPTIONS = [
  { id: 1, name: "Public" },
  { id: 2, name: "Friends" },
  { id: 3, name: "Private" },
];

/**
 * Mirrors mobile's NoCapPostCreateScreen fields (useNoCapPostCreateForm):
 * title, content, visibility, sector, habit stack, location, optional
 * image URL. Media upload via Firebase Storage isn't wired yet — an image
 * URL field stands in for mobile's picker.
 */
export default function NewPostPage() {
  const router = useRouter();
  const userId = useCurrentUserId();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("1");
  const [sectorId, setSectorId] = useState("");
  const [habitStackId, setHabitStackId] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sectors, setSectors] = useState<{ documentId: string; label: string }[]>([]);
  const [stacks, setStacks] = useState<HabitStackComponent[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    GetAllSectorComponents().then((res) => setSectors(Array.isArray(res.data) ? res.data : []));
  }, []);

  useEffect(() => {
    if (!userId || !sectorId) {
      setStacks([]);
      setHabitStackId("");
      return;
    }
    fetchHabitStackComponentsByUserAndSector(userId, sectorId).then((res) =>
      setStacks(Array.isArray(res.data) ? res.data : []),
    );
  }, [userId, sectorId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return void toast.error("Title is required");
    if (!sectorId) return void toast.error("Sector is required");
    if (!imageUrl && !content.trim()) return void toast.error("Add content or an image");

    setSaving(true);
    try {
      const res = await CreateNocapPost({
        id: crypto.randomUUID(),
        postVisibility: Number(visibility),
        title: title.trim(),
        content: content.trim(),
        sector: sectorId,
        habitType: habitStackId ? "habit-stack" : "",
        habitStackId,
        imageUrl: imageUrl || undefined,
        location: location.trim() || undefined,
        userId,
      });
      if (res.status >= 200 && res.status < 300) {
        toast.success("Post Successfully Created");
        router.push("/dashboard/posts");
      } else {
        toast.error("Failed to create post. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl pb-8">
      <h1 className="mb-6 text-[20px] font-bold text-white">Create Post</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[13px] text-white/50">Title</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] text-white/50">Content</label>
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[13px] text-white/50">Visibility</label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VISIBILITY_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] text-white/50">Sector</label>
            <Select value={sectorId} onValueChange={setSectorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector.documentId} value={sector.documentId}>
                    {sector.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {stacks.length > 0 ? (
          <div>
            <label className="mb-1.5 block text-[13px] text-white/50">Habit Stack</label>
            <Select value={habitStackId} onValueChange={setHabitStackId}>
              <SelectTrigger>
                <SelectValue placeholder="Attach a habit stack (optional)" />
              </SelectTrigger>
              <SelectContent>
                {stacks.map((stack) => (
                  <SelectItem key={stack.documentId ?? stack.id} value={stack.documentId ?? stack.id}>
                    {stack.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[13px] text-white/50">Location (optional)</label>
            <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] text-white/50">Image URL (optional)</label>
            <input className={inputClass} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Posting..." : "Post"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
