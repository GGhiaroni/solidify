import { BarChart3, BookOpen, Home, Map, Music, Timer } from "lucide-react";
import Link from "next/link";
import Logomarca from "./Logomarca";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Map, label: "Minha jornada", href: "/minha-jornada" },
  { icon: Timer, label: "Pomodoro", href: "/pomodoro" },
  { icon: BarChart3, label: "Study Tracker", href: "/tracker" },
  { icon: BookOpen, label: "Notas", href: "/notas" },
  { icon: Music, label: "Lofi Player", href: "/musica" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-medium border-r border-soft/20 p-6 flex flex-col sticky top-0">
      <Logomarca />

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 p-3 rounded-lg text-light/80 hover:bg-soft/10 hover:text-light transition-all group"
          >
            <item.icon
              size={20}
              className="group-hover:text-soft transition-colors"
            />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
