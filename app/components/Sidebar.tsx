"use client";

import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import { BarChart3, BookOpen, Gauge, Map, Music, Timer } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logomarca from "./Logomarca";

const menuItems = [
  { icon: Gauge, label: "Overview & Dashboard", href: "/dashboard" },
  { icon: Map, label: "Minhas jornadas", href: "/minhas-jornadas" },
  { icon: Timer, label: "Pomodoro", href: "/pomodoro" },
  { icon: BarChart3, label: "Study Tracker", href: "/tracker" },
  { icon: BookOpen, label: "Notas", href: "/notas" },
  { icon: Music, label: "Lofi Player", href: "/lofi" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="w-64 h-screen bg-medium p-6 flex flex-col sticky top-0">
      <Logomarca />

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group relative",

                isActive
                  ? "bg-blue-600/10 text-blue-400 font-medium"
                  : "text-soft hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full animate-in fade-in slide-in-from-left-1" />
              )}

              <item.icon
                size={20}
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-blue-500"
                    : "group-hover:text-white text-soft/70"
                )}
              />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 border border-white/10",
              },
            }}
          />

          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-white truncate">
              {user?.fullName || "Usuário"}
            </span>
            <span
              className="text-[10px] text-soft/60 truncate"
              title={user?.primaryEmailAddress?.emailAddress}
            >
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
