"use client";

import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Network,
  Users,
  KanbanSquare,
  History,
  Mic2,
  Clock3,
  Settings,
  DollarSign,
} from "lucide-react";
import { NavLink } from "@/components/nav-link";

export function Sidebar() {
  const t = useTranslations("app.nav");

  return (
    <aside className="hidden w-64 flex-col border-r border-white/10 bg-[#0b0b1a]/95 px-4 py-6 shadow-[0_0_30px_rgba(27,107,109,0.15)] backdrop-blur md:flex">
      <div className="mb-8">
        <div className="text-xl font-semibold text-white">Kohelet OS</div>
        <div className="text-xs text-muted-foreground">
          Multi-agent operations cockpit
        </div>
      </div>
      <nav className="space-y-1">
        <NavLink href="/" icon={<LayoutDashboard size={18} />}>
          {t("dashboard")}
        </NavLink>
        <NavLink href="/org-chart" icon={<Network size={18} />}>
          {t("orgChart")}
        </NavLink>
        <NavLink href="/agents" icon={<Users size={18} />}>
          {t("agents")}
        </NavLink>
        <NavLink href="/tasks" icon={<KanbanSquare size={18} />}>
          {t("tasks")}
        </NavLink>
        <NavLink href="/sessions" icon={<History size={18} />}>
          {t("sessions")}
        </NavLink>
        <NavLink href="/standups" icon={<Mic2 size={18} />}>
          {t("standups")}
        </NavLink>
        <NavLink href="/crons" icon={<Clock3 size={18} />}>
          {t("crons")}
        </NavLink>
        <NavLink href="/billing" icon={<DollarSign size={18} />}>
          {t("billing")}
        </NavLink>
        <NavLink href="/settings" icon={<Settings size={18} />}>
          {t("settings")}
        </NavLink>
      </nav>
    </aside>
  );
}
