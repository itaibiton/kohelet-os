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

  const mockStandups = [
    {
      _id: "mock-1",
      title: "Daily Ops Sync",
      participants: agents?.slice(0, 4).map((agent) => agent._id) ?? [],
      status: "completed",
      scheduledAt: Date.now() - 1000 * 60 * 60 * 6,
      completedAt: Date.now() - 1000 * 60 * 60 * 5,
      audioUrl: undefined,
    },
    {
      _id: "mock-2",
      title: "Product Pulse",
      participants: agents?.slice(2, 6).map((agent) => agent._id) ?? [],
      status: "completed",
      scheduledAt: Date.now() - 1000 * 60 * 60 * 30,
      completedAt: Date.now() - 1000 * 60 * 60 * 29,
      audioUrl: undefined,
    },
    {
      _id: "mock-3",
      title: "Leadership Briefing",
      participants: agents?.slice(0, 2).map((agent) => agent._id) ?? [],
      status: "scheduled",
      scheduledAt: Date.now() + 1000 * 60 * 60 * 3,
      completedAt: undefined,
      audioUrl: undefined,
    },
  ];

  const standupEntries =
    standups && standups.length > 0 ? standups : mockStandups;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Standups"
        description="Scheduled standups with transcripts and audio playback."
        actions={<Button>Start Standup</Button>}
      />
      {standups === undefined ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="h-40" />
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Standup Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {standupEntries.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-muted-foreground">
                No standups yet.
              </div>
            ) : (
              <div className="space-y-6">
                {standupEntries.map((standup) => {
                  const participants = standup.participants
                    .map((id) => agentById.get(id))
                    .filter(Boolean);
                  return (
                    <div key={standup._id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#1B6B6D]" />
                        <span className="mt-2 h-full w-px bg-white/10" />
                      </div>
                      <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-white">
                            {standup.title}
                          </div>
                          <Badge variant={statusVariant[standup.status] ?? "secondary"}>
                            {standup.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                          {participants.length > 0 ? (
                            participants.map((agent) => (
                              <span key={agent!._id} className="text-lg">
                                {agent!.emoji}
                              </span>
                            ))
                          ) : (
                            <span>No participants assigned.</span>
                          )}
                          <span className="text-zinc-500">
                            {standup.scheduledAt
                              ? new Date(standup.scheduledAt).toUTCString()
                              : standup.completedAt
                                ? new Date(standup.completedAt).toUTCString()
                                : "Date TBD"}
                          </span>
                        </div>
                        {standup.audioUrl ? (
                          <audio controls className="mt-3 w-full">
                            <source src={standup.audioUrl} />
                          </audio>
                        ) : (
                          <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-zinc-400">
                            No audio recorded.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
