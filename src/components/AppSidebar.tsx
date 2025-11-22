import { motion } from "framer-motion";
import { Home, BookOpen, Trophy, User, Bell, Search, TrendingUp, Users, Sparkles, ClipboardList, Building2, BarChart3, Settings, LogOut, GraduationCap, Network, FolderOpen, Upload, FileEdit, Route, Lightbulb, Gauge, Palette } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImage from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface MenuItem {
  title: string;
  url: string;
  icon: typeof Home;
  badge?: number;
}

interface AppSidebarProps {
  role: 'student' | 'teacher' | 'school-owner';
}

export function AppSidebar({ role }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const studentItems: MenuItem[] = [
    { title: "Dashboard", url: "/dashboard-siswa", icon: Home },
    { title: "Belajar", url: "/belajar", icon: BookOpen },
    { title: "Jalur Pembelajaran", url: "/learning-paths", icon: Route },
    { title: "Skill Tree", url: "/skill-tree", icon: Network },
    { title: "Rekomendasi", url: "/recommendations", icon: Lightbulb },
    { title: "Bank Soal", url: "/bank-soal", icon: ClipboardList },
    { title: "Chat AI", url: "/ai-chat", icon: Sparkles },
    { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
    { title: "Pencarian", url: "/search", icon: Search },
    { title: "Notifikasi", url: "/notifikasi", icon: Bell, badge: 3 },
    { title: "Profil", url: "/profil", icon: User },
  ];

  const teacherItems: MenuItem[] = [
    { title: "Dashboard", url: "/dashboard-guru", icon: Home },
    { title: "Materi", url: "/konten", icon: BookOpen },
    { title: "Skill Tree", url: "/teacher/skill-tree-management", icon: Network },
    { title: "Kalibrasi", url: "/calibration", icon: Gauge },
    { title: "Analitik", url: "/analytics", icon: BarChart3 },
    { title: "Tema", url: "/theme-customization", icon: Palette },
    { title: "Template Library", url: "/teacher/templates", icon: FolderOpen },
    { title: "Content Editor", url: "/teacher/content-editor", icon: FileEdit },
    { title: "Upload Content", url: "/teacher/upload-content", icon: Upload },
    { title: "Laporan", url: "/laporan", icon: TrendingUp },
    { title: "Profil", url: "/profil-guru", icon: User },
  ];

  const schoolOwnerItems: MenuItem[] = [
    { title: "Dashboard", url: "/school-owner-dashboard", icon: Home },
    { title: "Guru", url: "/teachers", icon: Users },
    { title: "Kelas", url: "/classes", icon: BookOpen },
    { title: "Mata Pelajaran", url: "/subjects", icon: GraduationCap },
    { title: "Analitik", url: "/analytics", icon: BarChart3 },
    { title: "Pengaturan", url: "/settings", icon: Settings },
    { title: "Profil", url: "/profile", icon: User },
  ];

  const items = role === 'student' ? studentItems : role === 'teacher' ? teacherItems : schoolOwnerItems;
  const isCollapsed = state === "collapsed";

  const getRoleLabel = () => {
    if (role === 'student') return 'Portal Siswa';
    if (role === 'teacher') return 'Portal Guru';
    return 'Portal School Owner';
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className={cn(
        "border-b p-4",
        isCollapsed && "p-2"
      )}>
        <div className={cn(
          "flex items-center gap-2",
          isCollapsed && "justify-center"
        )}>
          <img 
            src={logoImage} 
            alt="EduSmart Logo" 
            className={cn(
              "h-8 w-8 object-contain",
              isCollapsed && "h-6 w-6"
            )}
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                EduSmart
              </span>
              <span className="text-xs text-muted-foreground">
                {getRoleLabel()}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "px-4 py-2 text-xs font-semibold text-muted-foreground uppercase",
            isCollapsed && "hidden"
          )}>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "relative overflow-hidden transition-all duration-200",
                        isActive && "bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary font-medium hover:from-primary/15 hover:to-purple-500/15"
                      )}
                      tooltip={item.title}
                    >
                      <Link to={item.url} className="flex items-center gap-3 w-full">
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary via-purple-500 to-pink-500 rounded-r"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.3, type: "spring" }}
                          />
                        )}
                        
                        {/* Icon */}
                        <Icon className={cn(
                          "h-5 w-5 shrink-0 transition-colors",
                          isActive && "text-primary"
                        )} />
                        
                        {/* Title */}
                        <span className={cn(
                          "flex-1",
                          isActive && "font-semibold"
                        )}>
                          {item.title}
                        </span>
                        
                        {/* Badge */}
                        {item.badge && !isCollapsed && (
                          <motion.span
                            className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-destructive-foreground"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            {item.badge}
                          </motion.span>
                        )}
                        
                        {/* Badge dot when collapsed */}
                        {item.badge && isCollapsed && (
                          <motion.span
                            className="absolute -top-1 -right-1 flex h-2 w-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <span className="absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75 animate-ping" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
                          </motion.span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              tooltip="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
