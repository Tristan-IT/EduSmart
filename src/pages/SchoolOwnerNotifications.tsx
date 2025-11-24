import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Users, 
  BookOpen, 
  Calendar,
  Clock,
  Trash2,
  Check,
  X,
  BellOff,
  Building2,
  DollarSign
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";

interface Notification {
  _id: string;
  type: "success" | "warning" | "info" | "error";
  category: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

const SchoolOwnerNotifications = () => {
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIconByType = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "teacher":
        return <Users className="h-4 w-4" />;
      case "student":
        return <Users className="h-4 w-4" />;
      case "system":
        return <Calendar className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
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

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-700 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AppSidebar role="school-owner" />
        
        <main className="flex-1 overflow-auto">
          <motion.header
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md"
          >
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Notifikasi
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {unreadCount} notifikasi belum dibaca
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAsRead}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Tandai Semua Dibaca
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllRead}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus Yang Sudah Dibaca
                  </Button>
                </div>
              </div>
            </div>
          </motion.header>

          <div className="p-6 max-w-5xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all" className="gap-2">
                    <Bell className="h-4 w-4" />
                    Semua ({notifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="gap-2">
                    <BellOff className="h-4 w-4" />
                    Belum Dibaca ({unreadCount})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <Card className="p-12">
                      <div className="text-center">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Tidak Ada Notifikasi
                        </h3>
                        <p className="text-sm text-gray-500">
                          {filter === "unread" 
                            ? "Semua notifikasi sudah dibaca" 
                            : "Belum ada notifikasi masuk"}
                        </p>
                      </div>
                    </Card>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification._id}
                          variants={fadeInUp}
                          custom={index}
                          layout
                          exit={{ 
                            opacity: 0, 
                            x: -100,
                            transition: { duration: 0.2 }
                          }}
                        >
                        <Card 
                          className={`transition-all hover:shadow-md ${
                            !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="mt-1">{getIconByType(notification.type)}</div>
                              
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-semibold text-gray-900">
                                        {notification.title}
                                      </h3>
                                      {!notification.read && (
                                        <Badge variant="secondary" className="text-xs">
                                          Baru
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {notification.message}
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center gap-1">
                                    {!notification.read && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => markAsRead(notification._id)}
                                        className="h-8 w-8"
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => deleteNotification(notification._id)}
                                      className="h-8 w-8 text-red-500 hover:text-red-700"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(notification.createdAt), "PPp", { locale: id })}
                                  </div>
                                  <Badge 
                                    variant="outline" 
                                    className={`${getBadgeColor(notification.type)} flex items-center gap-1`}
                                  >
                                    {getCategoryIcon(notification.category)}
                                    {notification.category}
                                  </Badge>
                                </div>

                                {notification.actionUrl && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-blue-600"
                                    onClick={() => window.location.href = notification.actionUrl!}
                                  >
                                    Lihat Detail →
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    </AnimatePresence>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SchoolOwnerNotifications;
