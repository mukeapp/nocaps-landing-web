"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Sparkles, Store, UsersRound, Library } from "lucide-react";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { DeleteHabitStack, getHabitStackComponentsByUserId } from "@/lib/api/section-b/habit-stack";
import type { HabitStackComponent } from "@/types/section-b/habit";
import { Button } from "@/components/ui/button";
import { HabitStackCard } from "@/components/dashboard/habit-stack-card";
import { DataState } from "@/components/dashboard/data-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Score legend on mobile's MyHabitStacksScreen uses its own literal hex values,
// distinct from the tier-color map used by the card's ScoreDial — a real
// inconsistency in mobile itself, replicated as-is rather than "fixed".
const LEGEND = [
  { label: "BAD", color: "#e74c3c" },
  { label: "POOR", color: "#8e44ad" },
  { label: "AVERAGE", color: "#e67e22" },
  { label: "GOOD", color: "#27ae60" },
  { label: "EXCELLENT", color: "#f1c40f" },
  { label: "UNKNOWN", color: "#6B7280" },
];

export default function HabitStacksPage() {
  const userId = useCurrentUserId();
  const [stacks, setStacks] = useState<HabitStackComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!userId) return;
    setLoading(true);
    getHabitStackComponentsByUserId({ id: userId })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          setStacks(Array.isArray(res.data) ? res.data : []);
          setError(null);
        } else {
          setError("Unable to load your habit stacks.");
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    const res = await DeleteHabitStack({ id });
    if (res.status >= 200 && res.status < 300) {
      toast.success("Habit stack deleted.");
      load();
    } else {
      toast.error("Unable to delete habit stack.");
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-xl font-semibold text-white">Build Better habits, one day at a time.</h1>
      <p className="-mt-2 text-sm text-white/60">Let NoCap guide your journey!</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-white/[0.03] px-3 py-2">
        {LEGEND.map((tier) => (
          <span key={tier.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tier.color }} />
            <span className="text-[9px] font-semibold tracking-wide text-[#9CA3AF]">{tier.label}</span>
          </span>
        ))}
      </div>

      <DataState loading={loading || !userId} error={error}>
        {stacks.length === 0 ? (
          <div className="flex h-[45vh] items-center justify-center">
            <p className="text-base font-semibold text-white">No Habit Stack Found.</p>
          </div>
        ) : (
          <div>
            {stacks.map((stack) => {
              const id = stack.documentId ?? stack.id;
              return (
                <HabitStackCard
                  key={id}
                  stack={stack}
                  href={`/dashboard/habit-stacks/${id}`}
                  editHref={`/dashboard/habit-stacks/${id}/edit`}
                  onDelete={() => handleDelete(id)}
                />
              );
            })}
          </div>
        )}
      </DataState>

      <div className="flex items-center gap-2 pt-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-1">
              Add Habit Stack
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/market">
                <Store className="mr-2 h-4 w-4" />
                From Market
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/friends">
                <UsersRound className="mr-2 h-4 w-4" />
                From Friends
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/habit-library">
                <Library className="mr-2 h-4 w-4" />
                From My Library
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/ai">
                <Sparkles className="mr-2 h-4 w-4" />
                With AI
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button asChild className="flex-1">
          <Link href="/dashboard/habit-stacks/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Habit Stack
          </Link>
        </Button>
      </div>
    </div>
  );
}
