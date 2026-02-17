"use client";

import { Menu } from "lucide-react";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0b1a]/90 px-4 py-3 shadow-[0_8px_30px_rgba(2,6,23,0.6)] backdrop-blur sm:px-6 md:px-10 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            onClick={onMenuClick}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 text-white/80 transition hover:bg-white/5 md:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="text-sm text-muted-foreground">Kohelet OS</div>
        </div>
      </div>
    </header>
  );
}
