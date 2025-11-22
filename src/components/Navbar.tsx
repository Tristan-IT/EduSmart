import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogIn, Menu, Search, UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import logoImage from "@/assets/logo.png";

type NavbarRole = "guest" | "student" | "teacher";

interface NavbarProps {
  role?: NavbarRole;
  activeRoute?: string;
  onToggle?: () => void;
  onAuthAction?: (mode: "login" | "register") => void;
  onRegisterClick?: () => void;
}

const navConfig: Record<NavbarRole, Array<{ label: string; to: string; id?: string }>> = {
  guest: [
    { label: "Beranda", to: "/", id: "hero" },
    { label: "Fitur", to: "/#fitur", id: "fitur" },
    { label: "Harga", to: "/#harga", id: "harga" },
    { label: "Kontak", to: "/#kontak", id: "kontak" },
  ],
  student: [
    { label: "Dashboard", to: "/dashboard-siswa" },
    { label: "Jalur Belajar", to: "/belajar" },
    { label: "Leaderboard", to: "/leaderboard" },
    { label: "Notifikasi", to: "/notifikasi" },
  ],
  teacher: [
    { label: "Dashboard", to: "/dashboard-guru" },
    { label: "Siswa", to: "/dashboard-guru#siswa" },
    { label: "Laporan", to: "/dashboard-guru#laporan" },
    { label: "Konten", to: "/konten" },
  ],
};

export const Navbar = ({ role = "guest", activeRoute, onToggle, onAuthAction, onRegisterClick }: NavbarProps) => {
  const links = navConfig[role];
  const isGuest = role === "guest";
  const [activeSection, setActiveSection] = useState(0);
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Scroll spy untuk detect section aktif
  useEffect(() => {
    if (!isGuest || typeof window === 'undefined') return;

    const handleScroll = () => {
      const sections = links
        .map(link => link.id)
        .filter(Boolean)
        .map(id => document.getElementById(id!));

      let currentIndex = 0;
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section, index) => {
        if (section && section.offsetTop <= scrollPosition) {
          currentIndex = index;
        }
      });

      setActiveSection(currentIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isGuest, links]);

  // Update indicator position
  useEffect(() => {
    const activeNav = navRefs.current[activeSection];
    if (activeNav) {
      setIndicatorStyle({
        left: activeNav.offsetLeft,
        width: activeNav.offsetWidth,
      });
    }
  }, [activeSection]);

  const handleNavClick = (index: number, id?: string) => {
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setActiveSection(index);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          {onToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onToggle}
              aria-label="Buka navigasi"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-1">
            <img 
              src={logoImage} 
              alt="EduSmart Logo" 
              className="h-9 w-9 object-contain"
            />
            <div className="hidden flex-col leading-tight md:flex">
              <span className="text-sm font-semibold text-muted-foreground">Edu</span>
              <span className="text-base font-bold text-foreground">Smart</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links with Bubble Background */}
        <div className="hidden md:flex items-center relative">
          {/* Large Bubble Background */}
          <div className="absolute inset-0 -inset-x-4 bg-muted/40 backdrop-blur-sm rounded-full border border-border/50" />
          
          {/* Animated Indicator */}
          <motion.div
            className="absolute h-9 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full shadow-lg"
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30,
            }}
          />

          {/* Nav Links */}
          <div className="relative flex items-center gap-1 px-4 py-2">
            {links.map((link, index) => (
              <a
                key={link.to}
                ref={(el) => (navRefs.current[index] = el)}
                href={link.id ? `#${link.id}` : link.to}
                onClick={(e) => {
                  if (link.id) {
                    e.preventDefault();
                    handleNavClick(index, link.id);
                  }
                }}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full z-10",
                  activeSection === index
                    ? "text-primary-foreground"
                    : "text-foreground hover:text-foreground/80"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isGuest && (
            <>
              {/* Search Button */}
              <Button variant="ghost" size="icon" className="hidden md:inline-flex" aria-label="Cari">
                <Search className="h-5 w-5" />
              </Button>
              
              {/* Notification Button - Clean Design */}
              <Button variant="ghost" size="icon" className="relative" aria-label="Lihat notifikasi">
                <Bell className="h-5 w-5" />
                {/* Simple notification dot */}
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
              </Button>
              
              {/* Profile Button - Minimalist Design */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex gap-2 hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">AP</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">Profil</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <UserCircle2 className="h-5 w-5" />
              </Button>
            </>
          )}

          {isGuest && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-muted/50"
                asChild
              >
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Masuk</span>
                </Link>
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                onClick={onRegisterClick}
              >
                Daftar Gratis
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
