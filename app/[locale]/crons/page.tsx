"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scheduled Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {crons.map((cron) => {
              const agent = cron.agentId ? agentById.get(cron.agentId) : null;
              return (
                <div
                  key={cron._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/5 p-4 text-sm"
                >
                  <div>
                    <div className="text-white">{cron.name}</div>
                    <div className="text-muted-foreground">{cron.schedule}</div>
                    <div className="text-xs text-muted-foreground">
                      {agent ? `${agent.emoji} ${agent.name}` : "Unassigned"}
                    </div>
                    {cron.lastRun && (
                      <div className="text-xs text-muted-foreground">
                        Last run: {new Date(cron.lastRun).toUTCString()}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={cron.enabled ? "default" : "secondary"}>
                      {cron.enabled ? "enabled" : "disabled"}
                    </Badge>
                    <Button variant={cron.enabled ? "default" : "outline"} size="sm">
                      {cron.enabled ? "Disable" : "Enable"}
                    </Button>
                    {cron.lastOutput && (
                      <div className="max-w-xs text-xs text-muted-foreground">
                        {cron.lastOutput.slice(0, 60)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
