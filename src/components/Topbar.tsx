import { ChangeEvent, useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export interface TopbarUser {
  name: string;
  avatarUrl?: string;
  role?: string;
}

export interface TopbarProps {
  user?: TopbarUser;
  onSearch?: (term: string) => void;
  onMenuToggle?: () => void;
  notifications?: number;
  className?: string;
}

/**
 * Contoh penggunaan:
 * ```tsx
 * <Topbar
 *   user={{ name: "Tristan", role: "Siswa" }}
 *   onSearch={(term) => console.log(term)}
 * />
 * ```
 */
export const Topbar = ({ user, onSearch, onMenuToggle, notifications = 0, className }: TopbarProps) => {
  const { user: authUser } = useAuth();
  const [value, setValue] = useState("");

  const displayUser: TopbarUser = {
    name: user?.name ?? authUser?.name ?? "Pengguna",
    avatarUrl: user?.avatarUrl ?? authUser?.avatar,
    role: user?.role ?? authUser?.role,
  };

  const initials = displayUser.name.slice(0, 2).toUpperCase();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setValue(term);
    onSearch?.(term);
  };

  return (
    <header
      className={cn(
        "flex h-16 w-full items-center gap-4 border-b bg-card/95 px-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/70",
        className,
      )}
    >
      {onMenuToggle && (
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuToggle} aria-label="Toggle menu">
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={handleChange}
          placeholder="Cari topik, tugas, atau siswa..."
          className="h-10 rounded-full bg-muted pl-9 pr-4 text-sm focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifikasi">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-danger-foreground">
              {notifications}
            </span>
          )}
        </Button>

        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            {displayUser.avatarUrl ? (
              <AvatarImage src={displayUser.avatarUrl} alt={displayUser.name} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
          <div className="hidden flex-col text-sm leading-tight sm:flex">
            <span className="font-semibold text-foreground">{displayUser.name}</span>
            {displayUser.role && <span className="text-xs text-muted-foreground">{displayUser.role}</span>}
          </div>
        </div>
      </div>
    </header>
  );
};
