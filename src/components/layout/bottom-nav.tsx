"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Home, Settings2, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppRole } from "@/types/database";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/riwayat", label: "Riwayat", icon: ClipboardList },
  { href: "/profil", label: "Profil", icon: UserRound },
] as const;

export function BottomNav({ role }: { role: AppRole }) {
  const pathname = usePathname();
  const navItems =
    role === "SCC_ADMIN"
      ? [...items.slice(0, 2), { href: "/admin", label: "Master", icon: Settings2 }, items[2]]
      : [...items];

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0B2C5F]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-md items-stretch">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                active ? "text-white" : "text-white/60",
              )}
            >
              <Icon className="size-5" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

