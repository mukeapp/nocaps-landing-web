import { Pause, Play, Square } from "lucide-react";
import type { HabitStatus } from "@/types/section-b/habit";

// Mirrors mobile's status icon in HabitStackHeader's MetaRow: a plain filled
// circle (Colors.text_background) containing a play/stop/pause glyph in
// white — not a text badge.
export function StatusIcon({ status }: { status?: HabitStatus }) {
  const Icon = status === "STOP" ? Square : status === "PAUSE" ? Pause : Play;

  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5">
      <Icon className="h-3.5 w-3.5 fill-white text-white" />
    </div>
  );
}
