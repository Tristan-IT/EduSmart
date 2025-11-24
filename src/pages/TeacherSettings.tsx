import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Settings, 
  Bell, 
  Shield, 
  CheckCircle2, 
  Volume2,
  Moon,
  Sun,
  Globe,
  Save,
  AlertCircle,
  Palette,
  Database,
  Download,
  BookOpen,
  Users,
  Award,
  Lock,
  Eye,
  EyeOff,
  KeyRound
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import soundManager from "@/lib/soundManager";

const TeacherSettings = () => {
  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(() => soundManager.getSettings().enabled);
  const [soundVolume, setSoundVolume] = useState(() => soundManager.getSettings().volume * 100);
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    studentProgress: true,
    classUpdates: true,
    assignmentSubmissions: true,
    systemAnnouncements: false,
    weeklyDigest: true,
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    profileVisibility: "school",
  });
  
  // Academic preferences
  const [academicPreferences, setAcademicPreferences] = useState({
    defaultGradingSystem: "100",
    autoGrade: false,
    latePenalty: "10",
    maxRetakes: "2",
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Load settings from API on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/teacher/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            if (data.settings.notifications) setNotificationSettings(prev => ({ ...prev, ...data.settings.notifications }));
            if (data.settings.academic) setAcademicPreferences(prev => ({ ...prev, ...data.settings.academic }));
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
      }
    };
    
    loadSettings();
  }, []);

  // Handle sound settings change
  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    soundManager.setEnabled(enabled);
    if (enabled) {
      soundManager.play('achievement');
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const volume = values[0];
    setSoundVolume(volume);
    soundManager.setVolume(volume / 100);
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      
      // Save settings to backend
      const response = await fetch("http://localhost:5000/api/teacher/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          notifications: notificationSettings,
          privacy: privacySettings,
          academic: academicPreferences,
          sound: { enabled: soundEnabled, volume: soundVolume / 100 },
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan pengaturan");
      }

      setSuccess("Pengaturan berhasil disimpan!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AppSidebar role="teacher" />
        
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Pengaturan
                </h1>
                <p className="text-sm text-muted-foreground">
                  Kelola preferensi dan konfigurasi akun Anda
                </p>
              </div>
            </div>
          </motion.header>

          <div className="p-6 max-w-6xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              {/* Success/Error Messages */}
              {success && (
                <motion.div variants={fadeInUp}>
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {success}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {error && (
                <motion.div variants={fadeInUp}>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <Tabs defaultValue="notifications" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                  <TabsTrigger value="notifications" className="gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="hidden sm:inline">Notifikasi</span>
                  </TabsTrigger>
                  <TabsTrigger value="academic" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Akademik</span>
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
                <TabsContent value="notifications" className="space-y-6">
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-blue-600" />
                          Preferensi Notifikasi
                        </CardTitle>
                        <CardDescription>
                          Pilih jenis notifikasi yang ingin Anda terima
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Terima notifikasi via email
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Progress Siswa</Label>
                            <p className="text-sm text-muted-foreground">
                              Update pencapaian dan nilai siswa
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.studentProgress}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, studentProgress: checked })
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Update Kelas</Label>
                            <p className="text-sm text-muted-foreground">
                              Perubahan jadwal dan informasi kelas
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.classUpdates}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, classUpdates: checked })
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Pengumpulan Tugas</Label>
                            <p className="text-sm text-muted-foreground">
                              Notifikasi saat siswa mengumpulkan tugas
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.assignmentSubmissions}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, assignmentSubmissions: checked })
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Pengumuman Sistem</Label>
                            <p className="text-sm text-muted-foreground">
                              Informasi penting dari sekolah
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.systemAnnouncements}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, systemAnnouncements: checked })
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Ringkasan Mingguan</Label>
                            <p className="text-sm text-muted-foreground">
                              Laporan aktivitas mengajar setiap minggu
                            </p>
                          </div>
                          <Switch
                            checked={notificationSettings.weeklyDigest}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, weeklyDigest: checked })
                            }
                          />
                        </div>

                        <Separator />

                        <Button 
                          onClick={handleSave} 
                          disabled={loading}
                          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? "Menyimpan..." : "Simpan Pengaturan"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Academic Tab */}
                <TabsContent value="academic" className="space-y-6">
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-green-600" />
                          Preferensi Pengajaran
                        </CardTitle>
                        <CardDescription>
                          Konfigurasi sistem penilaian dan tugas
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="gradingSystem">Sistem Penilaian Default</Label>
                            <Select 
                              value={academicPreferences.defaultGradingSystem}
                              onValueChange={(value) =>
                                setAcademicPreferences({ ...academicPreferences, defaultGradingSystem: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="100">0 - 100</SelectItem>
                                <SelectItem value="10">1 - 10</SelectItem>
                                <SelectItem value="4">A - F (GPA 4.0)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="latePenalty">Pengurangan Keterlambatan (%)</Label>
                            <Input
                              id="latePenalty"
                              value={academicPreferences.latePenalty}
                              onChange={(e) =>
                                setAcademicPreferences({ ...academicPreferences, latePenalty: e.target.value })
                              }
                              placeholder="10"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="maxRetakes">Maksimal Mengulang Kuis</Label>
                            <Select 
                              value={academicPreferences.maxRetakes}
                              onValueChange={(value) =>
                                setAcademicPreferences({ ...academicPreferences, maxRetakes: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Tidak Boleh</SelectItem>
                                <SelectItem value="1">1 Kali</SelectItem>
                                <SelectItem value="2">2 Kali</SelectItem>
                                <SelectItem value="3">3 Kali</SelectItem>
                                <SelectItem value="unlimited">Unlimited</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Auto-Grading</Label>
                            <p className="text-sm text-muted-foreground">
                              Penilaian otomatis untuk pilihan ganda
                            </p>
                          </div>
                          <Switch
                            checked={academicPreferences.autoGrade}
                            onCheckedChange={(checked) =>
                              setAcademicPreferences({ ...academicPreferences, autoGrade: checked })
                            }
                          />
                        </div>

                        <Separator />

                        <Button 
                          onClick={handleSave} 
                          disabled={loading}
                          className="bg-gradient-to-r from-green-600 to-emerald-600"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? "Menyimpan..." : "Simpan Preferensi"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy" className="space-y-6">
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-purple-600" />
                          Privasi & Keamanan
                        </CardTitle>
                        <CardDescription>
                          Kontrol informasi yang ditampilkan ke publik
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Tampilkan Email</Label>
                            <p className="text-sm text-muted-foreground">
                              Email terlihat oleh siswa dan orang tua
                            </p>
                          </div>
                          <Switch
                            checked={privacySettings.showEmail}
                            onCheckedChange={(checked) =>
                              setPrivacySettings({ ...privacySettings, showEmail: checked })
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Tampilkan No. Telepon</Label>
                            <p className="text-sm text-muted-foreground">
                              Nomor telepon terlihat di profil publik
                            </p>
                          </div>
                          <Switch
                            checked={privacySettings.showPhone}
                            onCheckedChange={(checked) =>
                              setPrivacySettings({ ...privacySettings, showPhone: checked })
                            }
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Izinkan Pesan</Label>
                            <p className="text-sm text-muted-foreground">
                              Siswa dapat mengirim pesan langsung
                            </p>
                          </div>
                          <Switch
                            checked={privacySettings.allowMessages}
                            onCheckedChange={(checked) =>
                              setPrivacySettings({ ...privacySettings, allowMessages: checked })
                            }
                          />
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label htmlFor="profileVisibility">Visibilitas Profil</Label>
                          <Select 
                            value={privacySettings.profileVisibility}
                            onValueChange={(value) =>
                              setPrivacySettings({ ...privacySettings, profileVisibility: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Publik</SelectItem>
                              <SelectItem value="school">Hanya Sekolah</SelectItem>
                              <SelectItem value="classes">Hanya Kelas Saya</SelectItem>
                              <SelectItem value="private">Privat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <Button 
                          onClick={handleSave} 
                          disabled={loading}
                          className="bg-gradient-to-r from-purple-600 to-pink-600"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? "Menyimpan..." : "Simpan Pengaturan"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6">
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Volume2 className="h-5 w-5 text-orange-600" />
                          Suara & Efek
                        </CardTitle>
                        <CardDescription>
                          Konfigurasi efek suara dan notifikasi audio
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Aktifkan Suara</Label>
                            <p className="text-sm text-muted-foreground">
                              Mainkan efek suara untuk interaksi
                            </p>
                          </div>
                          <Switch
                            checked={soundEnabled}
                            onCheckedChange={handleSoundToggle}
                          />
                        </div>

                        <Separator />

                        {soundEnabled && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label>Volume Suara</Label>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(soundVolume)}%
                              </span>
                            </div>
                            <Slider
                              value={[soundVolume]}
                              onValueChange={handleVolumeChange}
                              min={0}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => soundManager.play('achievement')}
                              className="w-full"
                            >
                              <Volume2 className="h-4 w-4 mr-2" />
                              Test Suara
                            </Button>
                          </div>
                        )}

                        <Separator />

                        <Alert className="bg-blue-50 border-blue-200">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            Fitur dark mode dan kustomisasi tema akan segera tersedia.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TeacherSettings;
