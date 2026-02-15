import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";

const org = [
  {
    name: "Atlas",
    role: "CEO",
    tier: "csuite",
    children: [
      { name: "Forge", role: "CTO", tier: "manager" },
      { name: "Halo", role: "COO", tier: "manager" },
      { name: "Vera", role: "Chief of Staff", tier: "manager" },
    ],
  },
];

export default function OrgChartPage() {
  return (
    <div>
      <PageHeader
        title="Org Chart"
        description="Interactive view of agent hierarchy and reporting lines."
      />
      <div className="grid gap-6">
        {org.map((node) => (
          <Card key={node.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-xl">🌍</span>
                {node.name} — {node.role}
                <Badge variant="default" className="ml-auto">
                  {node.tier}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {node.children.map((child) => (
                <div
                  key={child.name}
                  className="rounded-lg border border-white/5 bg-white/5 p-4"
                >
                  <div className="text-white">{child.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {child.role}
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    {child.tier}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
