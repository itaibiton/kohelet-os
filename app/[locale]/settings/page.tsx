import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Workspace name</label>
            <Input placeholder="Kohelet OS" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Default models</label>
            <Input placeholder="opus46 / gemini-pro" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Status message</label>
            <Textarea placeholder="Operating status and release notes." />
          </div>
          <Button>Save settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
