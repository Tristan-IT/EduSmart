import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings,
  Bell,
  BookOpen,
  Shield,
  Palette,
  Volume2,
  CheckCircle2,
  Eye,
  Users,
  Clock,
  Target,
  Sparkles,
  Save
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import soundManager from "@/lib/soundManager";

interface NotificationSettings {
  emailNotifications: boolean;
  assignmentReminders: boolean;
  gradeUpdates: boolean;
  teacherMessages: boolean;
  parentNotifications: boolean;
  examSchedule: boolean;
  weeklyDigest: boolean;
}

interface LearningPreferences {
  studyReminders: boolean;
  dailyGoalMinutes: number;
  difficultyPreference: "easy" | "medium" | "hard" | "adaptive";
  learningMode: "visual" | "audio" | "kinesthetic" | "mixed";
  showHints: boolean;
}

interface PrivacySettings {
  parentAccessLevel: "full" | "progress-only" | "minimal";
  profileVisibility: "public" | "class-only" | "friends-only" | "private";
  allowPeerConnections: boolean;
  showOnlineStatus: boolean;
}

const StudentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(() => 
    soundManager.getSettings().enabled
  );
  const [soundVolume, setSoundVolume] = useState(() => 
    soundManager.getSettings().volume * 100
  );

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    assignmentReminders: true,
    gradeUpdates: true,
    teacherMessages: true,
    parentNotifications: true,
    examSchedule: true,
    weeklyDigest: false
  });

  const [learningPreferences, setLearningPreferences] = useState<LearningPreferences>({
    studyReminders: true,
    dailyGoalMinutes: 60,
    difficultyPreference: "adaptive",
    learningMode: "mixed",
    showHints: true
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    parentAccessLevel: "full",
    profileVisibility: "class-only",
    allowPeerConnections: true,
    showOnlineStatus: true
  });

  // Load settings from API on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/student/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            if (data.settings.notifications) setNotificationSettings(prev => ({ ...prev, ...data.settings.notifications }));
            if (data.settings.learning) setLearningPreferences(prev => ({ ...prev, ...data.settings.learning }));
            if (data.settings.privacy) setPrivacySettings(prev => ({ ...prev, ...data.settings.privacy }));
            if (data.settings.sound) {
              setSoundEnabled(data.settings.sound.enabled ?? true);
              setSoundVolume((data.settings.sound.volume ?? 0.5) * 100);
              soundManager.setEnabled(data.settings.sound.enabled ?? true);
              soundManager.setVolume(data.settings.sound.volume ?? 0.5);
            }
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
    soundManager.setEnabled(checked);
    if (checked) {
      soundManager.play("achievement");
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setSoundVolume(newVolume);
    soundManager.setVolume(newVolume / 100);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/student/settings", {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          notifications: notificationSettings,
          learning: learningPreferences,
          privacy: privacySettings,
          sound: { enabled: soundEnabled, volume: soundVolume }
        })
      });

      setSaveStatus({
        type: "success",
        message: "Pengaturan berhasil disimpan!"
      });

      if (soundEnabled) {
        soundManager.playSound("success");
      }

      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus({
        type: "error",
        message: "Gagal menyimpan pengaturan"
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <AppSidebar role="student" />

        <main className="flex-1 overflow-auto">
          <motion.header
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md"
          >
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Pengaturan
                </h1>
                <p className="text-sm text-muted-foreground">
                  Kelola preferensi belajar dan privasi Anda
                </p>
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
              {saveStatus && (
                <motion.div variants={fadeInUp}>
                  <Alert
                    variant={saveStatus.type === "error" ? "destructive" : "default"}
                    className={saveStatus.type === "success" ? "border-emerald-500 bg-emerald-50" : ""}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{saveStatus.message}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <motion.div variants={fadeInUp}>
                <Tabs defaultValue="notifications" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="notifications" className="gap-2">
                      <Bell className="h-4 w-4" />
                      <span className="hidden sm:inline">Notifikasi</span>
                    </TabsTrigger>
                    <TabsTrigger value="learning" className="gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">Pembelajaran</span>
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="hidden sm:inline">Privasi</span>
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="gap-2">
                      <Palette className="h-4 w-4" />
                      <span className="hidden sm:inline">Tampilan</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Notifications Tab */}
                  <TabsContent value="notifications" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-emerald-600" />
                          Preferensi Notifikasi
                        </CardTitle>
                        <CardDescription>
                          Atur notifikasi yang ingin Anda terima
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Notifikasi Email</Label>
                            <p className="text-sm text-muted-foreground">
                              Terima pembaruan penting via email
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({
                                ...prev,
                                emailNotifications: checked
                              }))
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Pengingat Tugas</Label>
                            <p className="text-sm text-muted-foreground">
                              Ingatkan saya tentang deadline tugas
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.assignmentReminders}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({
                                ...prev,
                                assignmentReminders: checked
                              }))
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Update Nilai</Label>
                            <p className="text-sm text-muted-foreground">
                              Notifikasi saat nilai baru tersedia
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.gradeUpdates}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({
                                ...prev,
                                gradeUpdates: checked
                              }))
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Pesan Guru</Label>
                            <p className="text-sm text-muted-foreground">
                              Notifikasi untuk pesan dari guru
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.teacherMessages}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({
                                ...prev,
                                teacherMessages: checked
                              }))
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Notifikasi ke Orang Tua</Label>
                            <p className="text-sm text-muted-foreground">
                              Kirim notifikasi progres ke orang tua
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.parentNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({
                                ...prev,
                                parentNotifications: checked
                              }))
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Jadwal Ujian</Label>
                            <p className="text-sm text-muted-foreground">
                              Pengingat jadwal ujian mendatang
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.examSchedule}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({
                                ...prev,
                                examSchedule: checked
                              }))
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Ringkasan Mingguan</Label>
                            <p className="text-sm text-muted-foreground">
                              Laporan progres belajar setiap minggu
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.weeklyDigest}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({
                                ...prev,
                                weeklyDigest: checked
                              }))
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Learning Tab */}
                  <TabsContent value="learning" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-emerald-600" />
                          Preferensi Pembelajaran
                        </CardTitle>
                        <CardDescription>
                          Sesuaikan pengalaman belajar Anda
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Pengingat Belajar</Label>
                            <p className="text-sm text-muted-foreground">
                              Ingatkan saya untuk belajar setiap hari
                            </p>
                          </div>
                          <Switch
                            checked={learningPreferences.studyReminders}
                            onCheckedChange={(checked) =>
                              setLearningPreferences((prev) => ({
                                ...prev,
                                studyReminders: checked
                              }))
                            }
                          />
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <Label className="text-base font-medium flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Target Belajar Harian
                          </Label>
                          <div className="flex items-center gap-4">
                            <Select
                              value={learningPreferences.dailyGoalMinutes.toString()}
                              onValueChange={(value) =>
                                setLearningPreferences((prev) => ({
                                  ...prev,
                                  dailyGoalMinutes: parseInt(value)
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">30 Menit</SelectItem>
                                <SelectItem value="60">60 Menit</SelectItem>
                                <SelectItem value="90">90 Menit</SelectItem>
                                <SelectItem value="120">120 Menit</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Durasi belajar yang ingin Anda capai setiap hari
                          </p>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <Label className="text-base font-medium flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Tingkat Kesulitan
                          </Label>
                          <Select
                            value={learningPreferences.difficultyPreference}
                            onValueChange={(value: any) =>
                              setLearningPreferences((prev) => ({
                                ...prev,
                                difficultyPreference: value
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Mudah - Materi dasar</SelectItem>
                              <SelectItem value="medium">Sedang - Materi standar</SelectItem>
                              <SelectItem value="hard">Sulit - Materi lanjutan</SelectItem>
                              <SelectItem value="adaptive">Adaptif - Sesuai kemampuan</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground">
                            Pilih tingkat kesulitan materi pembelajaran
                          </p>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <Label className="text-base font-medium flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Gaya Belajar
                          </Label>
                          <Select
                            value={learningPreferences.learningMode}
                            onValueChange={(value: any) =>
                              setLearningPreferences((prev) => ({
                                ...prev,
                                learningMode: value
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="visual">Visual - Gambar & diagram</SelectItem>
                              <SelectItem value="audio">Audio - Suara & penjelasan</SelectItem>
                              <SelectItem value="kinesthetic">Kinestetik - Praktik langsung</SelectItem>
                              <SelectItem value="mixed">Campuran - Kombinasi semua</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground">
                            Cara belajar yang paling cocok untuk Anda
                          </p>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Tampilkan Petunjuk</Label>
                            <p className="text-sm text-muted-foreground">
                              Tampilkan hint saat mengerjakan soal
                            </p>
                          </div>
                          <Switch
                            checked={learningPreferences.showHints}
                            onCheckedChange={(checked) =>
                              setLearningPreferences((prev) => ({
                                ...prev,
                                showHints: checked
                              }))
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Privacy Tab */}
                  <TabsContent value="privacy" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-emerald-600" />
                          Pengaturan Privasi
                        </CardTitle>
                        <CardDescription>
                          Kontrol siapa yang bisa melihat informasi Anda
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-base font-medium flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Akses Orang Tua
                          </Label>
                          <Select
                            value={privacySettings.parentAccessLevel}
                            onValueChange={(value: any) =>
                              setPrivacySettings((prev) => ({
                                ...prev,
                                parentAccessLevel: value
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full">Penuh - Semua informasi</SelectItem>
                              <SelectItem value="progress-only">Progres Saja - Nilai & tugas</SelectItem>
                              <SelectItem value="minimal">Minimal - Kehadiran saja</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground">
                            Tentukan informasi yang bisa dilihat orang tua
                          </p>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <Label className="text-base font-medium flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Visibilitas Profil
                          </Label>
                          <Select
                            value={privacySettings.profileVisibility}
                            onValueChange={(value: any) =>
                              setPrivacySettings((prev) => ({
                                ...prev,
                                profileVisibility: value
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Publik - Semua orang</SelectItem>
                              <SelectItem value="class-only">Kelas Saja - Teman sekelas</SelectItem>
                              <SelectItem value="friends-only">Teman Saja - Koneksi teman</SelectItem>
                              <SelectItem value="private">Privat - Hanya saya</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground">
                            Siapa yang bisa melihat profil Anda
                          </p>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Izinkan Koneksi Teman</Label>
                            <p className="text-sm text-muted-foreground">
                              Teman sekelas bisa terhubung dengan Anda
                            </p>
                          </div>
                          <Switch
                            checked={privacySettings.allowPeerConnections}
                            onCheckedChange={(checked) =>
                              setPrivacySettings((prev) => ({
                                ...prev,
                                allowPeerConnections: checked
                              }))
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Tampilkan Status Online</Label>
                            <p className="text-sm text-muted-foreground">
                              Tampilkan saat Anda sedang online
                            </p>
                          </div>
                          <Switch
                            checked={privacySettings.showOnlineStatus}
                            onCheckedChange={(checked) =>
                              setPrivacySettings((prev) => ({
                                ...prev,
                                showOnlineStatus: checked
                              }))
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Appearance Tab */}
                  <TabsContent value="appearance" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Palette className="h-5 w-5 text-emerald-600" />
                          Pengaturan Tampilan
                        </CardTitle>
                        <CardDescription>
                          Sesuaikan tampilan aplikasi
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-base font-medium">Efek Suara</Label>
                            <p className="text-sm text-muted-foreground">
                              Aktifkan suara untuk notifikasi dan achievement
                            </p>
                          </div>
                          <Switch
                            checked={soundEnabled}
                            onCheckedChange={handleSoundToggle}
                          />
                        </div>

                        {soundEnabled && (
                          <>
                            <Separator />
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="text-base font-medium flex items-center gap-2">
                                  <Volume2 className="h-4 w-4" />
                                  Volume Suara
                                </Label>
                                <span className="text-sm text-muted-foreground">
                                  {Math.round(soundVolume * 100)}%
                                </span>
                              </div>
                              <Slider
                                value={[soundVolume]}
                                onValueChange={handleVolumeChange}
                                max={1}
                                step={0.01}
                                className="w-full"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => soundManager.play("achievement")}
                                className="w-full"
                              >
                                <Volume2 className="h-4 w-4 mr-2" />
                                Test Suara
                              </Button>
                            </div>
                          </>
                        )}

                        <Separator />

                        <Alert>
                          <Sparkles className="h-4 w-4" />
                          <AlertDescription>
                            Fitur tema warna dan dark mode akan segera hadir!
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Button
                  onClick={handleSave}
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Simpan Semua Pengaturan
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentSettings;
