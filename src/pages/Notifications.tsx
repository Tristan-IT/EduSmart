import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, TrendingUp, BookOpen, Users, CheckCircle2, Trash2, Bell } from "lucide-react";
import { mockNotifications } from "@/data/gamificationData";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useState } from "react";
import { fadeInUp, scaleIn, staggerContainer } from "@/lib/animations";

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-5 h-5 text-gold" />;
      case 'streak': return <Flame className="w-5 h-5 text-warning" />;
      case 'leaderboard': return <TrendingUp className="w-5 h-5 text-accent" />;
      case 'quiz': return <BookOpen className="w-5 h-5 text-primary" />;
      case 'social': return <Users className="w-5 h-5 text-purple" />;
      default: return <CheckCircle2 className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
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
            {notifications.length === 0 ? (
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
                      Notifikasi baru akan muncul di sini
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
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
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
                              }`}
                              whileHover={{ scale: 1.1, rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              {getIcon(notification.type)}
                            </motion.div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-semibold">{notification.title}</h4>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {notification.time}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {notification.message}
                              </p>
                              
                              <div className="flex gap-2 mt-3">
                                {!notification.read && (
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => markAsRead(notification.id)}
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
                                    onClick={() => deleteNotification(notification.id)}
                                    className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Hapus
                                  </Button>
                                </motion.div>
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
