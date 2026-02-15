"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MODEL_RATES = [
  { model: "opus46", input: 15, output: 75 },
  { model: "gemini-pro", input: 0, output: 0 },
  { model: "gemini/gemini-flash", input: 0, output: 0 },
  { model: "codex", input: 2, output: 8 },
  { model: "codex-mini", input: 1.5, output: 6 },
  { model: "grok", input: 5, output: 15 },
  { model: "grok-fast", input: 3, output: 10 },
];

const infrastructureCosts = [
  { service: "AWS EC2 m7i-flex.large", type: "Compute", monthly: 70.0 },
  { service: "AWS EBS 30GB gp3", type: "Storage", monthly: 2.4 },
  { service: "AWS Data Transfer", type: "Network", monthly: 4.0 },
  { service: "Genspark Plus", type: "AI Creative", monthly: 24.99 },
  { service: "Google Workspace (REOS)", type: "Email/Drive", monthly: 12.0 },
  { service: "Vercel Hobby", type: "Hosting", monthly: 0.0 },
  { service: "Convex Free", type: "Database", monthly: 0.0 },
  { service: "Clerk Free", type: "Auth", monthly: 0.0 },
  { service: "GitHub Free", type: "Code", monthly: 0.0 },
  { service: "Brave Search Free", type: "Search", monthly: 0.0 },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function BillingPage() {
  const sessions = useQuery(api.sessions.list);

  const { aiCost, totalTokens, lastUpdated } = useMemo(() => {
    if (!sessions) {
      return { aiCost: 0, totalTokens: 0, lastUpdated: "--" };
    }
    const aiCostValue = sessions.reduce(
      (sum, session) => sum + (session.cost ?? 0),
      0
    );
    const tokenCount = sessions.reduce(
      (sum, session) => sum + (session.tokenCount ?? 0),
      0
    );
    return {
      aiCost: aiCostValue,
      totalTokens: tokenCount,
      lastUpdated: new Date().toLocaleString(),
    };
  }, [sessions]);

  const awsCost = 70;
  const servicesCost = 24.99 + 12;
  const totalEstimated = awsCost + servicesCost + aiCost;

  const modelRows = MODEL_RATES.map((rate) => ({
    model: rate.model,
    price:
      rate.input === 0 && rate.output === 0
        ? "FREE"
        : `$${rate.input}/$${rate.output}`,
    sessions: 0,
    tokens: 0,
    cost: 0,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Track AI usage, infrastructure spend, and optimization levers."
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="border-emerald-500/30 bg-emerald-500/10">
          <CardHeader>
            <CardTitle className="text-sm text-emerald-200">
              Total Estimated Cost
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-white">
            {formatCurrency(totalEstimated)}
          </CardContent>
        </Card>
        <Card className="border-blue-500/30 bg-blue-500/10">
          <CardHeader>
            <CardTitle className="text-sm text-blue-200">AWS EC2 Cost</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-white">
            {formatCurrency(awsCost)}
            <div className="mt-1 text-xs text-muted-foreground">
              m7i-flex.large
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-sm text-emerald-200">AI API Cost</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-white">
            {formatCurrency(aiCost)}
            <div className="mt-1 text-xs text-muted-foreground">
              {totalTokens.toLocaleString()} tokens processed
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-sm text-blue-200">Services Cost</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-white">
            {formatCurrency(servicesCost)}
            <div className="mt-1 text-xs text-muted-foreground">
              Genspark + Google Workspace
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Cost Breakdown</CardTitle>
          <div className="text-xs text-muted-foreground">
            Placeholder aggregation — add model tracking to sessions for live splits.
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="pb-2">Model</th>
                <th className="pb-2">Price (Input/Output per 1M)</th>
                <th className="pb-2">Sessions</th>
                <th className="pb-2">Tokens</th>
                <th className="pb-2">Est. Cost</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {modelRows.map((row) => (
                <tr key={row.model} className="border-t border-white/5">
                  <td className="py-3 font-medium">{row.model}</td>
                  <td className="py-3">
                    {row.price === "FREE" ? (
                      <Badge variant="secondary">FREE</Badge>
                    ) : (
                      row.price
                    )}
                  </td>
                  <td className="py-3 text-muted-foreground">{row.sessions}</td>
                  <td className="py-3 text-muted-foreground">
                    {row.tokens.toLocaleString()}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {formatCurrency(row.cost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Infrastructure Costs</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="pb-2">Service</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Monthly Cost</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {infrastructureCosts.map((item) => (
                <tr key={item.service} className="border-t border-white/5">
                  <td className="py-3 font-medium">{item.service}</td>
                  <td className="py-3 text-muted-foreground">{item.type}</td>
                  <td className="py-3 text-muted-foreground">
                    {item.service.includes("Total")
                      ? item.monthly
                      : formatCurrency(item.monthly)}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-white/5 font-semibold">
                <td className="py-3">Total Infrastructure</td>
                <td className="py-3 text-muted-foreground"></td>
                <td className="py-3 text-muted-foreground">~$113</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cost Optimization Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>• Switch to Mac Mini: Save ~$70/mo (ROI: 8 months)</div>
          <div>
            • Use Gemini (free) for routine tasks instead of Opus ($75/1M output)
          </div>
          <div>• Batch similar cron jobs to reduce session spawns</div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        Last updated: {lastUpdated}
      </div>
    </div>
  );
}
