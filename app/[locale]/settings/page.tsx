"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const models = [
  { name: "claude-opus-4-6", alias: "default_model" },
  { name: "gpt-5.2-codex", alias: "coding" },
  { name: "claude-sonnet-4", alias: "fast" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure the Kohelet OS environment and defaults."
      />

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>OpenClaw Connection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Server URL</span>
              <span className="text-white">gateway.kohelet-os.local</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status</span>
              <Badge className="bg-emerald-500/20 text-emerald-200">
                Connected
              </Badge>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-xs text-zinc-400">
              Secure tunnel established. Last heartbeat: 30s ago.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Appearance</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary">
                  Dark
                </Button>
                <Button size="sm" variant="ghost">
                  Light
                </Button>
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-xs">
              Premium dark UI enabled by default. Light mode is available soon.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Model Configuration</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {models.map((model) => (
            <div
              key={model.name}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="text-sm font-semibold text-white">
                {model.name}
              </div>
              <div className="mt-2 text-xs text-zinc-400">
                Alias: <span className="text-zinc-200">{model.alias}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Badge variant="secondary">Primary</Badge>
                <Badge className="bg-[#1B6B6D]/20 text-[#7bdadb]">
                  Available
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {[
            { label: "Critical alerts", desc: "Failures, outages, and high-priority incidents." },
            { label: "Standup summaries", desc: "Daily standup completion digest." },
            { label: "Cost threshold", desc: "Notify when daily cost exceeds $50." },
            { label: "Agent idle", desc: "Alert when core agents are inactive." },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div>
                <div className="text-sm font-semibold text-white">
                  {item.label}
                </div>
                <div className="text-xs text-zinc-400">{item.desc}</div>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-200">Stub</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
