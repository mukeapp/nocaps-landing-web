import { CircleUserRound, CreditCard, HelpCircle, FileText, ShieldCheck } from "lucide-react";
import { AppearanceSettings } from "@/components/dashboard/appearance-settings";
import { SettingsRow } from "@/components/dashboard/settings-row";

export const metadata = { title: "Settings — NoCaps" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <AppearanceSettings />

      <div className="space-y-2">
        <h2 className="px-1 text-sm font-medium text-muted-foreground">Account & billing</h2>
        <div className="space-y-2">
          <SettingsRow icon={CircleUserRound} label="Account" href="/dashboard/account" />
          <SettingsRow icon={CreditCard} label="Subscription & credits" href="/dashboard/subscription" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="px-1 text-sm font-medium text-muted-foreground">Support</h2>
        <div className="space-y-2">
          <SettingsRow icon={HelpCircle} label="Help & Feedback" href="https://discord.gg/g3ceKGYA" external />
          <SettingsRow
            icon={FileText}
            label="Terms of Service"
            href="https://www.donocap.com/terms-and-conditions"
            external
          />
          <SettingsRow
            icon={ShieldCheck}
            label="Privacy Policy"
            href="https://www.donocap.com/privacy-policy"
            external
          />
        </div>
      </div>
    </div>
  );
}
