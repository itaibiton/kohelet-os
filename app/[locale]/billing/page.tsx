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
  { service: "AWS EC2 m7i-flex.large", type: "Compute", monthly: 70.0, icon: "🖥️" },
  { service: "AWS EBS 30GB gp3", type: "Storage", monthly: 2.4, icon: "💾" },
  { service: "AWS Data Transfer", type: "Network", monthly: 4.0, icon: "🌐" },
  { service: "Genspark Plus", type: "AI Creative", monthly: 24.99, icon: "✨" },
  { service: "Google Workspace (REOS)", type: "Email/Drive", monthly: 12.0, icon: "📧" },
  { service: "Vercel Hobby", type: "Hosting", monthly: 0.0, icon: "⚡" },
  { service: "Convex Free", type: "Database", monthly: 0.0, icon: "🧠" },
  { service: "Clerk Free", type: "Auth", monthly: 0.0, icon: "🔐" },
];

const savingsTips = [
  "Switch to Mac Mini for local inference and save ~$70/mo",
  "Use Gemini for low-stakes tasks to reduce premium token spend",
  "Batch cron jobs to cut session spawn overhead",
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

  const breakdown = [
    { label: "Infrastructure", value: awsCost, color: "bg-blue-500" },
    { label: "Services", value: servicesCost, color: "bg-indigo-500" },
    { label: "AI Usage", value: aiCost, color: "bg-emerald-500" },
  ];
  const total = breakdown.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Track AI usage, infrastructure spend, and optimization levers."
      />

      <Card className="border border-white/5 bg-white/[0.03]">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-3">
            <div className="text-sm text-zinc-400">Total Monthly Cost</div>
            <div className="text-4xl font-semibold text-white">
              {formatCurrency(totalEstimated)}
            </div>
            <div className="text-sm text-zinc-500">
              Updated {lastUpdated}
            </div>
            <div className="space-y-2 pt-2 text-sm text-zinc-400">
              {breakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <span className="text-white">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-sm text-zinc-400">Cost Breakdown</div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              {breakdown.map((item, index) => (
                <div
                  key={item.label}
                  className={`${item.color} h-3`}
                  style={{ width: `${(item.value / total) * 100}%`, display: "inline-block" }}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {breakdown.map((item) => (
                <div key={item.label} className="rounded-xl border border-white/5 bg-white/[0.04] p-3">
                  <div className="text-xs text-zinc-500">{item.label}</div>
                  <div className="text-sm font-semibold text-white">
                    {formatCurrency(item.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-white/5 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-base">Infrastructure Costs</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-zinc-500">
                <tr>
                  <th className="pb-2">Service</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Monthly Cost</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {infrastructureCosts.map((item, index) => (
                  <tr
                    key={item.service}
                    className={`border-t border-white/5 ${
                      index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                    }`}
                  >
                    <td className="py-3 font-medium">
                      <span className="mr-2">{item.icon}</span>
                      {item.service}
                    </td>
                    <td className="py-3 text-zinc-400">{item.type}</td>
                    <td className="py-3 text-zinc-400">{formatCurrency(item.monthly)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="border border-white/5 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-base">AI Costs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-white/5 bg-white/[0.04] p-4">
              <div className="text-sm text-zinc-400">Tokens processed</div>
              <div className="text-2xl font-semibold text-white">
                {totalTokens.toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.04] p-4">
              <div className="text-sm text-zinc-400">AI Spend</div>
              <div className="text-2xl font-semibold text-white">
                {formatCurrency(aiCost)}
              </div>
            </div>
            <div className="text-xs text-zinc-500">
              Placeholder aggregation — add model tracking to sessions for live splits.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-white/5 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-base">Model Rate Reference</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-zinc-500">
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
                  <td className="py-3 text-zinc-400">{row.sessions}</td>
                  <td className="py-3 text-zinc-400">
                    {row.tokens.toLocaleString()}
                  </td>
                  <td className="py-3 text-zinc-400">
                    {formatCurrency(row.cost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {savingsTips.map((tip) => (
          <Card key={tip} className="border border-emerald-500/20 bg-emerald-500/10">
            <CardContent className="p-4 text-sm text-emerald-100">
              {tip}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
