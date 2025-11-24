import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, TrendingUp, BookOpen, Users, CheckCircle2, Trash2, Bell, Award, Calendar, Info, AlertCircle, Clock, BellOff } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useState, useEffect } from "react";
import { fadeInUp, scaleIn, staggerContainer } from "@/lib/animations";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Notification {
  _id: string;
  type: "success" | "info" | "warning" | "error";
  category: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const queryParams = filter === "unread" ? "?read=false" : "";
      const response = await fetch(`http://localhost:5000/api/notifications${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal memuat notifikasi");
      
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Gagal memuat notifikasi");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal menandai sebagai dibaca");
      
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
      toast.success("Notifikasi ditandai sebagai dibaca");
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Gagal menandai notifikasi");
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/notifications/read-all`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal menandai semua sebagai dibaca");
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success("Semua notifikasi ditandai sebagai dibaca");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Gagal menandai semua notifikasi");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal menghapus notifikasi");
      
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success("Notifikasi berhasil dihapus");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Gagal menghapus notifikasi");
    }
  };

  const clearAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/notifications/clear/all`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal menghapus notifikasi");
      
      setNotifications(prev => prev.filter(n => !n.read));
      toast.success("Semua notifikasi yang sudah dibaca telah dihapus");
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("Gagal menghapus notifikasi");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "achievement": return <Trophy className="h-5 w-5" />;
      case "streak": return <Flame className="h-5 w-5" />;
      case "leaderboard": return <TrendingUp className="h-5 w-5" />;
      case "lesson": return <BookOpen className="h-5 w-5" />;
      case "assignment": return <Calendar className="h-5 w-5" />;
      case "quiz": return <Award className="h-5 w-5" />;
      case "class": return <Users className="h-5 w-5" />;
      case "system": return <Info className="h-5 w-5" />;
      case "announcement": return <Bell className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar role="student" />
        <div className="flex-1">
          {/* Enhanced Header */}
          <motion.header 
            className="sticky top-0 z-50 h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex h-full items-center px-4 gap-4">
              <SidebarTrigger />
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="p-2 rounded-lg bg-gradient-to-br from-primary to-purple-600"
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: unreadCount > 0 ? [1, 1.1, 1] : 1
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, repeatDelay: 3 },
                      scale: { duration: 1, repeat: Infinity }
                    }}
                  >
                    <Bell className="w-5 h-5 text-white" />
                  </motion.div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Notifikasi
                  </h1>
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      >
                        <Badge 
                          variant="destructive" 
                          className="rounded-full px-2 min-w-[24px] h-6 flex items-center justify-center"
                        >
                          {unreadCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead}
                      className="gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Tandai Semua Dibaca
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.header>

          <div className="container px-4 py-8 max-w-3xl mx-auto">
            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")} className="mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="all" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Semua
                </TabsTrigger>
                <TabsTrigger value="unread" className="gap-2">
                  <BellOff className="h-4 w-4" />
                  Belum Dibaca ({unreadCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Tandai Semua Dibaca
                  </Button>
                )}
                {notifications.some(n => n.read) && (
                  <Button variant="outline" size="sm" onClick={clearAllRead} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Hapus Yang Sudah Dibaca
                  </Button>
                )}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardContent className="py-12 text-center">
                    <motion.div 
                      className="text-6xl mb-4"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      🔔
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">Tidak Ada Notifikasi</h3>
                    <p className="text-muted-foreground">
                      {filter === "unread" ? "Semua notifikasi sudah dibaca" : "Notifikasi baru akan muncul di sini"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-3"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <AnimatePresence mode="popLayout">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      variants={fadeInUp}
                      layout
                      exit={{ 
                        opacity: 0, 
                        x: -100,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Card 
                        className={`group hover:shadow-lg transition-all duration-300 ${
                          !notification.read ? 'border-primary/50 bg-primary/5' : ''
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <motion.div 
                              className={`p-3 rounded-full ${
                                !notification.read ? 'bg-primary/10' : 'bg-muted'
                              } ${getTypeColor(notification.type)}`}
                              whileHover={{ scale: 1.1, rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              {getCategoryIcon(notification.category)}
                            </motion.div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{notification.title}</h4>
                                  {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {format(new Date(notification.createdAt), "d MMM, HH:mm", { locale: idLocale })}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex gap-2 flex-wrap">
                                {!notification.read && (
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => markAsRead(notification._id)}
                                      className="h-8 text-xs"
                                    >
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Tandai Dibaca
                                    </Button>
                                  </motion.div>
                                )}
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => deleteNotification(notification._id)}
                                    className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Hapus
                                  </Button>
                                </motion.div>
                                {notification.actionUrl && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => window.location.href = notification.actionUrl!}
                                    className="h-8 text-xs"
                                  >
                                    Lihat Detail →
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Notifications;
