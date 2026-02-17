"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function formatRelative(timestamp?: number) {
  if (!timestamp) return "--";
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CronsPage() {
  const crons = useQuery(api.cronJobs.list);
  const agents = useQuery(api.agents.list);
  const agentById = new Map(agents?.map((agent) => [agent._id, agent]) ?? []);

  return (
    <div>
      <PageHeader
        title="Crons"
        description="Automated schedules and OpenClaw cron monitoring."
        actions={<Button variant="outline">Add cron</Button>}
      />
      {crons === undefined ? (
        <Card className="animate-pulse">
          <CardContent className="h-24" />
        </Card>
      ) : crons.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            No cron jobs yet.
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-white/5 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-base">Scheduled Jobs</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-zinc-500">
                <tr>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Schedule</th>
                  <th className="pb-3">Agent</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Last Run</th>
                  <th className="pb-3">Last Output</th>
                  <th className="pb-3 text-right">Enabled</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {crons.map((cron, index) => {
                  const agent = cron.agentId ? agentById.get(cron.agentId) : null;
                  return (
                    <tr
                      key={cron._id}
                      className={`border-t border-white/5 ${
                        index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                      }`}
                    >
                      <td className="py-4 font-medium">{cron.name}</td>
                      <td className="py-4 text-zinc-400">{cron.schedule}</td>
                      <td className="py-4 text-zinc-400">
                        {agent ? `${agent.emoji} ${agent.name}` : "Unassigned"}
                      </td>
                      <td className="py-4">
                        <Badge className={cron.enabled ? "bg-emerald-500/20 text-emerald-200" : "bg-white/10 text-zinc-300"}>
                          {cron.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </td>
                      <td className="py-4 text-zinc-400">
                        {formatRelative(cron.lastRun)}
                      </td>
                      <td className="py-4 text-zinc-400">
                        {cron.lastOutput
                          ? cron.lastOutput.slice(0, 80)
                          : "--"}
                      </td>
                      <td className="py-4 text-right">
                        <label className="inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            defaultChecked={cron.enabled}
                          />
                          <span className="relative h-6 w-11 rounded-full bg-white/10 transition peer-checked:bg-emerald-500/40 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
