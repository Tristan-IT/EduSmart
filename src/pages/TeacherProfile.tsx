import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Edit2, Upload, Camera, Bell, User, Volume2, LogOut, Users, BookOpen, Award, Clock, TrendingUp, Mail, Phone, MapPin, Building2, GraduationCap, Calendar, Sparkles } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { toast } from "sonner";
import soundManager from "@/lib/soundManager";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fadeInUp, staggerContainer, hoverLift } from "@/lib/animations";

const TeacherProfile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    return localStorage.getItem('teacherProfileImage');
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const infoSectionRef = useRef<HTMLDivElement>(null);
  
  // Sound settings state
  const [soundEnabled, setSoundEnabled] = useState(() => soundManager.getSettings().enabled);
  const [soundVolume, setSoundVolume] = useState(() => soundManager.getSettings().volume * 100);
  
  // Teacher data
  const [teacherData, setTeacherData] = useState({
    name: "Bu Sarah Wijaya",
    email: "sarah@edusmart.com",
    phone: "+62 812-3456-7890",
    subject: "Matematika",
    school: "SMK TI Bali Global Badung",
    address: "Bali",
    joinDate: "Januari 2020",
    bio: "Guru Matematika dengan 15+ tahun pengalaman mengajar. Passionate tentang teknologi pendidikan dan pembelajaran adaptif.",
  });

  // Teacher stats
  const teacherStats = {
    totalStudents: 120,
    activeClasses: 4,
    materialsCreated: 45,
    averageScore: 78,
    interventions: 23,
    teachingHours: 1250,
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    toast.success("Logout berhasil! Sampai jumpa lagi.");
    navigate("/");
  };

  // Sound settings handlers
  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    soundManager.setEnabled(enabled);
    if (enabled) {
      soundManager.play("achievement");
      toast.success("Efek suara diaktifkan");
    } else {
      toast.info("Efek suara dinonaktifkan");
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const volume = value[0];
    setSoundVolume(volume);
    soundManager.setVolume(volume / 100);
  };

  // Profile image handlers
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        localStorage.setItem('teacherProfileImage', imageData);
        toast.success("Foto profil berhasil diperbarui!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success("Profil berhasil diperbarui!");
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    // Scroll to info section after a brief delay
    setTimeout(() => {
      infoSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  return (
    <SidebarProvider>
      <AppSidebar role="teacher" />
      <main className="flex-1 w-full">
        {/* Header */}
        <motion.div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-3 flex-1">
              <User className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Profil Guru
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container px-6 py-8 max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            {/* Profile Header Card */}
            <motion.div variants={fadeInUp}>
              <Card className="overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
                <CardContent className="relative pt-16 pb-6">
                  {/* Avatar */}
                  <div className="absolute -top-16 left-6">
                    <motion.div
                      className="relative"
                      onMouseEnter={() => setAvatarHover(true)}
                      onMouseLeave={() => setAvatarHover(false)}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Avatar className="h-32 w-32 border-4 border-background">
                        <AvatarImage src={profileImage || undefined} />
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-purple-600 text-white">
                          {teacherData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {avatarHover && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-8 w-8 text-white" />
                        </motion.div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </motion.div>
                  </div>

                  <div className="ml-44 flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{teacherData.name}</h2>
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <GraduationCap className="h-4 w-4" />
                        {teacherData.subject}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Building2 className="h-4 w-4" />
                        {teacherData.school}
                      </p>
                      <Badge className="mt-2" variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        Bergabung sejak {teacherData.joinDate}
                      </Badge>
                    </div>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => isEditing ? handleSaveProfile() : handleEditProfile()}
                    >
                      {isEditing ? "Simpan" : <><Edit2 className="h-4 w-4 mr-2" />Edit Profil</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={fadeInUp}>
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Siswa</p>
                        <p className="text-2xl font-bold">{teacherStats.totalStudents}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <BookOpen className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Kelas Aktif</p>
                        <p className="text-2xl font-bold">{teacherStats.activeClasses}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Materi</p>
                        <p className="text-2xl font-bold">{teacherStats.materialsCreated}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-yellow-500/10">
                        <TrendingUp className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rata-rata</p>
                        <p className="text-2xl font-bold">{teacherStats.averageScore}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10">
                        <Award className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Intervensi</p>
                        <p className="text-2xl font-bold">{teacherStats.interventions}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/10">
                        <Clock className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Jam Mengajar</p>
                        <p className="text-2xl font-bold">{teacherStats.teachingHours}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={fadeInUp}>
              <Tabs defaultValue="info" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Informasi</TabsTrigger>
                  <TabsTrigger value="settings">Pengaturan</TabsTrigger>
                </TabsList>

                {/* Info Tab */}
                <TabsContent value="info" className="space-y-4">
                  <Card ref={infoSectionRef}>
                    <CardHeader>
                      <CardTitle>Informasi Pribadi</CardTitle>
                      <CardDescription>Data diri dan kontak</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nama Lengkap</Label>
                          <Input
                            value={teacherData.name}
                            onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <Input
                              type="email"
                              value={teacherData.email}
                              onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Nomor Telepon</Label>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <Input
                              value={teacherData.phone}
                              onChange={(e) => setTeacherData({ ...teacherData, phone: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Mata Pelajaran</Label>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <Input
                              value={teacherData.subject}
                              onChange={(e) => setTeacherData({ ...teacherData, subject: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Sekolah</Label>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <Input
                              value={teacherData.school}
                              onChange={(e) => setTeacherData({ ...teacherData, school: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Alamat</Label>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <Input
                              value={teacherData.address}
                              onChange={(e) => setTeacherData({ ...teacherData, address: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <textarea
                          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={teacherData.bio}
                          onChange={(e) => setTeacherData({ ...teacherData, bio: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notifikasi</CardTitle>
                      <CardDescription>Kelola preferensi notifikasi</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Notifikasi Email</p>
                            <p className="text-sm text-muted-foreground">Terima update melalui email</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Notifikasi Siswa Berisiko</p>
                            <p className="text-sm text-muted-foreground">Alert ketika ada siswa yang butuh perhatian</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Update Laporan</p>
                            <p className="text-sm text-muted-foreground">Laporan mingguan progress siswa</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Audio</CardTitle>
                      <CardDescription>Pengaturan efek suara</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Volume2 className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Efek Suara</p>
                            <p className="text-sm text-muted-foreground">Aktifkan efek suara sistem</p>
                          </div>
                        </div>
                        <Switch checked={soundEnabled} onCheckedChange={handleSoundToggle} />
                      </div>
                      {soundEnabled && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Volume</Label>
                            <span className="text-sm text-muted-foreground">{Math.round(soundVolume)}%</span>
                          </div>
                          <Slider
                            value={[soundVolume]}
                            onValueChange={handleVolumeChange}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-destructive/50">
                    <CardHeader>
                      <CardTitle className="text-destructive">Keluar dari Akun</CardTitle>
                      <CardDescription>Logout dari platform EduSmart</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="destructive" 
                        onClick={handleLogout}
                        className="w-full"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default TeacherProfile;
