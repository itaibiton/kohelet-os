import { mutation } from "./_generated/server";
import { v } from "convex/values";

const baseStatus = "idle" as const;

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const agents = [
      {
        key: "atlas",
        name: "Atlas",
        role: "COO",
        emoji: "🌍",
        tier: "csuite" as const,
        department: "executive",
        persona:
          "Sharp, warm, gets stuff done. Chief Operating Officer managing all business operations, email, calendar, drive, briefings, intel. Always delegates to specialists — never executes tasks directly.",
        primaryModel: "opus46",
        secondaryModel: "gemini-pro",
        fallbackModel: "gemini",
      },
      {
        key: "forge",
        name: "Forge",
        role: "CTO",
        emoji: "🔨",
        tier: "csuite" as const,
        department: "executive",
        persona:
          "Technical, precise, architect-minded. Chief Technology Officer overseeing all development, DevOps, QA, and product documentation. Makes architecture decisions and manages technical strategy.",
        primaryModel: "opus46",
        secondaryModel: "codex",
        fallbackModel: "gemini-pro",
      },
      {
        key: "iris",
        name: "Iris",
        role: "Email Manager",
        emoji: "📧",
        tier: "manager" as const,
        department: "admin",
        persona:
          "Efficient email triage specialist. Classifies, drafts replies, tracks follow-ups across all accounts.",
        primaryModel: "gemini",
        secondaryModel: "gemini-pro",
        fallbackModel: "grok-fast",
      },
      {
        key: "tempo",
        name: "Tempo",
        role: "Calendar Manager",
        emoji: "📅",
        tier: "manager" as const,
        department: "admin",
        persona:
          "Precise scheduler. Manages calendar across accounts, coordinates meetings, sends reminders.",
        primaryModel: "gemini",
        secondaryModel: "gemini-pro",
        fallbackModel: "grok-fast",
      },
      {
        key: "vault",
        name: "Vault",
        role: "Drive Manager",
        emoji: "📁",
        tier: "manager" as const,
        department: "admin",
        persona:
          "Organized file manager. Manages Google Drive, organizes docs, maintains file structure.",
        primaryModel: "gemini",
        secondaryModel: "gemini-pro",
        fallbackModel: "grok-fast",
      },
      {
        key: "muse",
        name: "Muse",
        role: "Creative Director",
        emoji: "🎨",
        tier: "manager" as const,
        department: "creative",
        persona:
          "Visionary creative director. Leads brand, design, content strategy. Uses Nano Banana Pro, Whisk, Flow for visual creation.",
        primaryModel: "opus46",
        secondaryModel: "gemini-pro",
        fallbackModel: "gemini",
      },
      {
        key: "scout",
        name: "Scout",
        role: "BizDev Manager",
        emoji: "🔍",
        tier: "manager" as const,
        department: "bizdev",
        persona:
          "Strategic business developer. Researches leads, prepares proposals, tracks opportunities and partnerships.",
        primaryModel: "gemini-pro",
        secondaryModel: "grok",
        fallbackModel: "gemini",
      },
      {
        key: "nexus",
        name: "Nexus",
        role: "Frontend Dev Manager",
        emoji: "💻",
        tier: "manager" as const,
        department: "dev",
        persona:
          "Expert frontend architect. Leads React/Next.js/TypeScript development. Code reviews and component architecture.",
        primaryModel: "codex",
        secondaryModel: "codex-mini",
        fallbackModel: "gemini-pro",
      },
      {
        key: "core",
        name: "Core",
        role: "Backend Dev Manager",
        emoji: "⚙️",
        tier: "manager" as const,
        department: "dev",
        persona:
          "Backend systems architect. Manages Convex, APIs, database design, server-side logic.",
        primaryModel: "codex",
        secondaryModel: "codex-mini",
        fallbackModel: "gemini-pro",
      },
      {
        key: "pipe",
        name: "Pipe",
        role: "DevOps Manager",
        emoji: "🚀",
        tier: "manager" as const,
        department: "devops",
        persona:
          "Infrastructure specialist. CI/CD pipelines, deployment, monitoring, server management.",
        primaryModel: "codex-mini",
        secondaryModel: "gemini",
        fallbackModel: "grok-fast",
      },
      {
        key: "lens",
        name: "Lens",
        role: "QA Manager",
        emoji: "🔬",
        tier: "manager" as const,
        department: "qa",
        persona:
          "Quality guardian. Testing, code review, security audits, performance analysis.",
        primaryModel: "codex",
        secondaryModel: "gemini-pro",
        fallbackModel: "gemini",
      },
      {
        key: "wiki",
        name: "Wiki",
        role: "Product Manager",
        emoji: "📖",
        tier: "manager" as const,
        department: "product",
        persona:
          "Documentation master. Manages Notion, writes PRDs, specs, maintains product knowledge base.",
        primaryModel: "gemini-pro",
        secondaryModel: "gemini",
        fallbackModel: "grok-fast",
      },
      {
        key: "pixel",
        name: "Pixel",
        role: "UI/UX Designer",
        emoji: "🖌️",
        tier: "worker" as const,
        department: "creative",
        persona:
          "UI/UX specialist. Mockups, design specs, visual components. Uses Nano Banana Pro.",
        primaryModel: "opus46",
      },
      {
        key: "quill",
        name: "Quill",
        role: "Copywriter",
        emoji: "✍️",
        tier: "worker" as const,
        department: "creative",
        persona:
          "Marketing copywriter. Website copy, emails, proposals, social posts.",
        primaryModel: "gemini-pro",
      },
      {
        key: "reel",
        name: "Reel",
        role: "Video Creator",
        emoji: "🎬",
        tier: "worker" as const,
        department: "creative",
        persona:
          "Video content creator. Concepts, scripts, motion graphics. Uses Google Flow + Veo.",
        primaryModel: "gemini",
      },
      {
        key: "hype",
        name: "Hype",
        role: "Social Media",
        emoji: "📣",
        tier: "worker" as const,
        department: "creative",
        persona:
          "Social media specialist. Posts, scheduling, trending analysis, engagement.",
        primaryModel: "grok",
      },
      {
        key: "react",
        name: "React",
        role: "Frontend Dev",
        emoji: "⚛️",
        tier: "worker" as const,
        department: "dev",
        persona:
          "React/Next.js component specialist. Pages, layouts, hooks, client-side logic.",
        primaryModel: "codex",
      },
      {
        key: "style",
        name: "Style",
        role: "CSS/Design Dev",
        emoji: "💅",
        tier: "worker" as const,
        department: "dev",
        persona:
          "TailwindCSS expert. Animations, responsive design, visual polish.",
        primaryModel: "codex-mini",
      },
      {
        key: "schema",
        name: "Schema",
        role: "Database Dev",
        emoji: "🗄️",
        tier: "worker" as const,
        department: "dev",
        persona:
          "Convex schema specialist. Mutations, queries, data modeling, migrations.",
        primaryModel: "codex",
      },
      {
        key: "auth",
        name: "Auth",
        role: "Auth Dev",
        emoji: "🔐",
        tier: "worker" as const,
        department: "dev",
        persona:
          "Authentication specialist. Clerk flows, permissions, roles, security.",
        primaryModel: "codex-mini",
      },
      {
        key: "intel",
        name: "Intel",
        role: "Research Analyst",
        emoji: "🕵️",
        tier: "worker" as const,
        department: "bizdev",
        persona:
          "Deep research analyst. Competitor monitoring, market analysis, intel reports.",
        primaryModel: "gemini",
      },
      {
        key: "pitch",
        name: "Pitch",
        role: "Pitch Specialist",
        emoji: "📊",
        tier: "worker" as const,
        department: "bizdev",
        persona:
          "Pitch deck and proposal specialist. One-pagers, investor materials, presentations.",
        primaryModel: "gemini-pro",
      },
      {
        key: "net",
        name: "Net",
        role: "CRM/People",
        emoji: "🤝",
        tier: "worker" as const,
        department: "bizdev",
        persona:
          "Networking and CRM specialist. People tracking, relationship management, follow-ups.",
        primaryModel: "gemini",
      },
      {
        key: "sentry",
        name: "Sentry",
        role: "Security Worker",
        emoji: "🛡️",
        tier: "worker" as const,
        department: "devops",
        persona:
          "Security and monitoring specialist. Vulnerability scanning, alerts, incident response.",
        primaryModel: "codex",
      },
      {
        key: "audit",
        name: "Audit",
        role: "QA Worker",
        emoji: "📋",
        tier: "worker" as const,
        department: "qa",
        persona:
          "Test engineer. Unit tests, integration tests, E2E testing, bug reports.",
        primaryModel: "codex",
      },
    ];

    const ids: Record<string, string> = {};

    for (const agent of agents) {
      const { key, ...data } = agent;
      const id = await ctx.db.insert("agents", {
        ...data,
        status: baseStatus,
        totalTokens: 0,
        totalCost: 0,
      });
      ids[key] = id;
    }

    return ids;
  },
});

export const seedRelations = mutation({
  args: {
    ids: v.object({
      atlas: v.id("agents"),
      forge: v.id("agents"),
      iris: v.id("agents"),
      tempo: v.id("agents"),
      vault: v.id("agents"),
      muse: v.id("agents"),
      scout: v.id("agents"),
      nexus: v.id("agents"),
      core: v.id("agents"),
      pipe: v.id("agents"),
      lens: v.id("agents"),
      wiki: v.id("agents"),
      pixel: v.id("agents"),
      quill: v.id("agents"),
      reel: v.id("agents"),
      hype: v.id("agents"),
      react: v.id("agents"),
      style: v.id("agents"),
      schema: v.id("agents"),
      auth: v.id("agents"),
      intel: v.id("agents"),
      pitch: v.id("agents"),
      net: v.id("agents"),
      sentry: v.id("agents"),
      audit: v.id("agents"),
    }),
  },
  handler: async (ctx, { ids }) => {
    await ctx.db.patch(ids.iris, { reportsTo: ids.atlas });
    await ctx.db.patch(ids.tempo, { reportsTo: ids.atlas });
    await ctx.db.patch(ids.vault, { reportsTo: ids.atlas });
    await ctx.db.patch(ids.muse, { reportsTo: ids.atlas });
    await ctx.db.patch(ids.scout, { reportsTo: ids.atlas });

    await ctx.db.patch(ids.nexus, { reportsTo: ids.forge });
    await ctx.db.patch(ids.core, { reportsTo: ids.forge });
    await ctx.db.patch(ids.pipe, { reportsTo: ids.forge });
    await ctx.db.patch(ids.lens, { reportsTo: ids.forge });
    await ctx.db.patch(ids.wiki, { reportsTo: ids.forge });

    await ctx.db.patch(ids.pixel, { reportsTo: ids.muse });
    await ctx.db.patch(ids.quill, { reportsTo: ids.muse });
    await ctx.db.patch(ids.reel, { reportsTo: ids.muse });
    await ctx.db.patch(ids.hype, { reportsTo: ids.muse });

    await ctx.db.patch(ids.react, { reportsTo: ids.nexus });
    await ctx.db.patch(ids.style, { reportsTo: ids.nexus });
    await ctx.db.patch(ids.schema, { reportsTo: ids.core });
    await ctx.db.patch(ids.auth, { reportsTo: ids.core });

    await ctx.db.patch(ids.intel, { reportsTo: ids.scout });
    await ctx.db.patch(ids.pitch, { reportsTo: ids.scout });
    await ctx.db.patch(ids.net, { reportsTo: ids.scout });

    await ctx.db.patch(ids.sentry, { reportsTo: ids.pipe });
    await ctx.db.patch(ids.audit, { reportsTo: ids.lens });
  },
});
