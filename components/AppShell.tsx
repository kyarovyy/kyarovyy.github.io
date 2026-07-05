"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, FileUp, LayoutDashboard, Settings, SlidersHorizontal } from "lucide-react";
import { ReactNode } from "react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/topics", label: "Themen", icon: BookOpen },
  { href: "/test", label: "Test", icon: SlidersHorizontal },
  { href: "/progress", label: "Fortschritt", icon: BarChart3 },
  { href: "/upload", label: "Upload", icon: FileUp },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-x-0 top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur lg:inset-y-0 lg:right-auto lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center px-5 lg:h-20">
          <Link href="/dashboard" className="text-lg font-semibold tracking-normal text-ink">
            Accounting Trainer
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring flex min-w-max items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                  active ? "bg-leaf text-white" : "text-ink/75 hover:bg-black/5"
                }`}
              >
                <Icon size={18} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="px-4 pb-10 pt-24 sm:px-6 lg:ml-64 lg:px-10 lg:pt-10">{children}</main>
    </div>
  );
}
