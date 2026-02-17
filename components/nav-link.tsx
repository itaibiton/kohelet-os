"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

function resolveHref(locale: string | undefined, href: string) {
  if (!locale) return href;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

export function NavLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params?.locale as string | undefined;
  const resolvedHref = resolveHref(locale, href);
  const isActive = pathname === resolvedHref || pathname?.startsWith(`${resolvedHref}/`);

  return (
    <Link
      href={resolvedHref}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/5 hover:text-white hover:shadow-[0_0_16px_rgba(27,107,109,0.18)]",
        isActive && "bg-white/10 text-white shadow-[0_0_18px_rgba(196,135,90,0.2)]"
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
