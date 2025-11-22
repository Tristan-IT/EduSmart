import { ComponentType } from "react";
import { Home, BookOpen, Trophy, Search, Bell, User, Users, FileText, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type LeftNavRole = "student" | "teacher" | "admin";

export interface LeftNavProps {
  role: LeftNavRole;
  activeRoute: string;
  collapsed?: boolean;
  onToggle: () => void;
  className?: string;
}

const navItems: Record<LeftNavRole, Array<{ label: string; to: string; icon: ComponentType<{ className?: string }> }>> = {
  student: [
    { label: "Dashboard", to: "/dashboard-siswa", icon: Home },
    { label: "Jalur Belajar", to: "/belajar", icon: BookOpen },
    { label: "Leaderboard", to: "/leaderboard", icon: Trophy },
    { label: "Pencarian", to: "/search", icon: Search },
    { label: "Notifikasi", to: "/notifikasi", icon: Bell },
    { label: "Profil", to: "/profil", icon: User },
  ],
  teacher: [
    { label: "Dashboard", to: "/dashboard-guru", icon: Home },
    { label: "Siswa", to: "/dashboard-guru#siswa", icon: Users },
    { label: "Konten", to: "/konten", icon: BookOpen },
    { label: "Laporan", to: "/laporan", icon: FileText },
    { label: "Pengaturan", to: "/admin", icon: Settings },
  ],
  admin: [
    { label: "Ringkasan", to: "/admin", icon: Home },
    { label: "Pengguna", to: "/admin/users", icon: Users },
    { label: "Laporan", to: "/laporan", icon: FileText },
    { label: "Integrasi", to: "/admin/integrasi", icon: Settings },
  ],
};

export const LeftNav = ({ role, activeRoute, collapsed, onToggle, className }: LeftNavProps) => {
  const items = navItems[role];

  return (
    <aside
      className={cn(
        "hidden border-r bg-sidebar text-sidebar-foreground transition-all duration-300 lg:flex", // default hidden on small screens
  collapsed ? "w-20" : "w-64",
        className,
      )}
    >
      <div className="flex h-full w-full flex-col">
        <div className="flex items-center justify-between px-4 py-4">
          <span className={cn("text-sm font-semibold uppercase tracking-wide", collapsed && "hidden")}>Navigasi</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
            aria-label={collapsed ? "Buka navigasi" : "Sembunyikan navigasi"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  activeRoute === item.to && "bg-sidebar-accent text-sidebar-foreground",
                )}
                activeClassName="bg-sidebar-accent text-sidebar-foreground"
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
