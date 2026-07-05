"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectVisibleCompanies } from "@/redux/ai-models-cost-multiplier";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Mirrors mobile's AIModelSelector (core/components/section-b/
 * ai-model-selector): company picker + model picker fed from the
 * ai-models-cost-multiplier redux registry, showing each model's
 * NoCap cost multiplier.
 */
export function AIModelSelector({
  companyName,
  modelId,
  onCompanyChange,
  onModelChange,
}: {
  companyName: string;
  modelId: string;
  onCompanyChange: (companyName: string, defaultModelId: string) => void;
  onModelChange: (modelId: string) => void;
}) {
  const companies = useAppSelector(selectVisibleCompanies);
  const company = companies.find((c) => c.name === companyName) ?? companies[0];
  const models = (company?.models ?? []).filter((m) => m.isVisible !== false);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="mb-1.5 block text-[13px] text-white/50">AI Provider</label>
        <Select
          value={company?.name}
          onValueChange={(name) => {
            const next = companies.find((c) => c.name === name);
            const nextModels = (next?.models ?? []).filter((m) => m.isVisible !== false);
            const def = nextModels.find((m) => m.isDefault) ?? nextModels[0];
            onCompanyChange(name, def?.id ?? "");
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {companies.map((c) => (
              <SelectItem key={c.name} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] text-white/50">Model</label>
        <Select value={modelId} onValueChange={onModelChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {models.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name} (×{m.noCapCostMultiplier})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
