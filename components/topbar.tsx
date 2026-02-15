"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", key: "dashboard" },
  { href: "/org-chart", key: "orgChart" },
  { href: "/agents", key: "agents" },
  { href: "/tasks", key: "tasks" },
  { href: "/sessions", key: "sessions" },
  { href: "/standups", key: "standups" },
  { href: "/crons", key: "crons" },
  { href: "/settings", key: "settings" },
];

function resolveHref(locale: string | undefined, href: string) {
  if (!locale) return href;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

export function Topbar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params?.locale as string | undefined;
  const t = useTranslations("app.nav");

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0b0b1a]/80 px-6 py-4 backdrop-blur md:px-10">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Kohelet OS</div>
        <nav className="flex flex-wrap items-center gap-3 md:hidden">
          {navItems.map((item) => {
            const href = resolveHref(locale, item.href);
            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  "rounded-md px-2 py-1 text-xs text-muted-foreground",
                  pathname === href && "bg-white/10 text-white"
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
