"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure the Kohelet OS environment and defaults."
      />
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>App name</span>
            <span className="text-white">Kohelet OS</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Version</span>
            <span className="text-white">v0.1.1</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Convex URL</span>
            <span className="text-white">
              {process.env.NEXT_PUBLIC_CONVEX_URL ?? "Not configured"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
