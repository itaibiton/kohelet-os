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
  X,
} from "lucide-react";
import { NavLink } from "@/components/nav-link";
import { cn } from "@/lib/utils";

export function Sidebar({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const t = useTranslations("app.nav");

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-black/60 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-[#0b0b1a]/95 px-4 py-6 shadow-[0_0_30px_rgba(27,107,109,0.15)] backdrop-blur transition-transform duration-200 md:static md:z-auto md:flex md:w-64 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center justify-between md:block">
          <div>
            <div className="text-xl font-semibold text-white">Kohelet OS</div>
            <div className="text-xs text-muted-foreground">
              Multi-agent operations cockpit
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 text-white/80 transition hover:bg-white/5 md:hidden"
          >
            <X size={18} />
          </button>
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
    </>
  );
}
