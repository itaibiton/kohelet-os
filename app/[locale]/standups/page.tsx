"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const statusVariant: Record<string, "default" | "secondary" | "warning" | "danger"> = {
  scheduled: "secondary",
  in_progress: "warning",
  completed: "default",
};

export default function StandupsPage() {
  const standups = useQuery(api.standups.list);
  const agents = useQuery(api.agents.list);
  const agentById = new Map(agents?.map((agent) => [agent._id, agent]) ?? []);

  return (
    <div>
      <PageHeader
        title="Standups"
        description="Scheduled standups with transcripts and audio playback."
        actions={<Button>Schedule standup</Button>}
      />
      {standups === undefined ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="h-40" />
            </Card>
          ))}
        </div>
      ) : standups.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            No standups yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {standups.map((standup) => {
            const participants = standup.participants
              .map((id) => agentById.get(id))
              .filter(Boolean);
            return (
              <Card key={standup._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {standup.title}
                    <Badge variant={statusVariant[standup.status] ?? "secondary"}>
                      {standup.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-2">
                    {participants.length > 0 ? (
                      participants.map((agent) => (
                        <span key={agent!._id} className="text-xl">
                          {agent!.emoji}
                        </span>
                      ))
                    ) : (
                      <span>No participants assigned.</span>
                    )}
                  </div>
                  <div>
                    {standup.scheduledAt
                      ? new Date(standup.scheduledAt).toUTCString()
                      : standup.completedAt
                        ? new Date(standup.completedAt).toUTCString()
                        : "Date TBD"}
                  </div>
                  {standup.audioUrl ? (
                    <audio controls className="w-full">
                      <source src={standup.audioUrl} />
                    </audio>
                  ) : (
                    <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-xs">
                      No audio recorded.
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
