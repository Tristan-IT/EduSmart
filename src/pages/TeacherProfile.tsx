import { useState, useRef, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit2, Upload, Camera, Bell, User, Volume2, LogOut, Users, BookOpen, Award, Clock, TrendingUp, Mail, Phone, MapPin, Building2, GraduationCap, Calendar, Sparkles, CheckCircle2, Target, Activity, Zap, Shield, Lock, KeyRound } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { toast } from "sonner";
import soundManager from "@/lib/soundManager";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fadeInUp, staggerContainer, hoverLift } from "@/lib/animations";

const TeacherProfile = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    return localStorage.getItem('teacherProfileImage');
  });
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const infoSectionRef = useRef<HTMLDivElement>(null);
  
  // Sound settings state
  const [soundEnabled, setSoundEnabled] = useState(() => soundManager.getSettings().enabled);
  const [soundVolume, setSoundVolume] = useState(() => soundManager.getSettings().volume * 100);
  
  // Teacher data from API
  const [teacherData, setTeacherData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    subject: "",
    subjects: [] as string[],
    school: "",
    schoolName: "",
    address: "",
    joinDate: "",
    bio: "",
    employeeId: "",
    qualification: "",
    totalClasses: 0,
  });

  // Teacher stats from API
  const [teacherStats, setTeacherStats] = useState({
    totalStudents: 0,
    activeClasses: 0,
    materialsCreated: 0,
    averageScore: 0,
    interventions: 0,
    teachingHours: 0,
  });

  // Load teacher profile from API
  useEffect(() => {
    loadTeacherProfile();
  }, []);

  const loadTeacherProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Load profile
      const profileRes = await fetch("http://localhost:5000/api/teacher/profile/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.success && profileData.data) {
          const profile = profileData.data;
          
          // Format subjects - get names from subjectRefs if available
          let subjectNames: string[] = [];
          if (profile.teacherProfile?.subjectRefs && Array.isArray(profile.teacherProfile.subjectRefs)) {
            subjectNames = profile.teacherProfile.subjectRefs.map((sub: any) => sub.name || sub);
          } else if (profile.teacherProfile?.subjects) {
            subjectNames = profile.teacherProfile.subjects;
          }
          
          setTeacherData({
            name: profile.name || user?.name || "",
            email: profile.email || user?.email || "",
            phone: profile.phone || "",
            subject: subjectNames[0] || "",
            subjects: subjectNames,
            school: profile.school?.schoolId || profile.schoolId || "",
            schoolName: profile.school?.schoolName || profile.schoolName || "",
            address: profile.address || "",
            joinDate: new Date(profile.createdAt || Date.now()).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
            }),
            bio: profile.teacherProfile?.bio || "",
            employeeId: profile.teacherProfile?.employeeId || "",
            qualification: profile.teacherProfile?.qualification || "",
            totalClasses: profile.teacherProfile?.classes?.length || 0,
          });
          
          if (profile.avatar && !profileImage) {
            setProfileImage(profile.avatar);
          }
        }
      }

      // Load stats
      const statsRes = await fetch("http://localhost:5000/api/teacher-dashboard/my-analytics", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success && statsData.data) {
          setTeacherStats({
            totalStudents: statsData.data.totalStudents || 0,
            activeClasses: statsData.data.totalClasses || 0,
            materialsCreated: statsData.data.materialsCreated || 0,
            averageScore: statsData.data.averageProgress || 0,
            interventions: statsData.data.interventions || 0,
            teachingHours: 0,
          });
        }
      }
    } catch (error) {
      console.error("Failed to load teacher profile:", error);
      toast.error("Gagal memuat data profil");
    } finally {
      setLoading(false);
    }
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

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/teacher/profile/me", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: teacherData.name,
          phone: teacherData.phone,
          address: teacherData.address,
          bio: teacherData.bio,
          employeeId: teacherData.employeeId,
          qualification: teacherData.qualification,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsEditing(false);
        toast.success("Profil berhasil diperbarui!");
        
        // Reload profile to get fresh data
        loadTeacherProfile();
      } else {
        toast.error(data.message || "Gagal memperbarui profil");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Gagal memperbarui profil");
    }
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

  const [updateStatus, setUpdateStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setUpdateStatus({
        type: "error",
        message: "Password baru dan konfirmasi tidak cocok",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setUpdateStatus({
        type: "error",
        message: "Password minimal 6 karakter",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/teacher/profile/password", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUpdateStatus({
          type: "success",
          message: "Password berhasil diubah!",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setUpdateStatus(null), 3000);
      } else {
        setUpdateStatus({
          type: "error",
          message: data.message || "Gagal mengubah password",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setUpdateStatus({
        type: "error",
        message: "Gagal mengubah password",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AppSidebar role="teacher" />

        <main className="flex-1 overflow-auto">
          {/* Header */}
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
                  Profil Saya
                </h1>
                <p className="text-sm text-muted-foreground">
                  Kelola profil dan lihat statistik mengajar Anda
                </p>
              </div>
            </div>
          </motion.header>

          <div className="p-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="mt-4 text-gray-600">Memuat data...</p>
              </div>
            </div>
          ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            {updateStatus && (
              <motion.div variants={fadeInUp}>
                <Alert
                  variant={updateStatus.type === "error" ? "destructive" : "default"}
                  className={updateStatus.type === "success" ? "border-emerald-500 bg-emerald-50" : ""}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{updateStatus.message}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Profile Header Card */}
            <motion.div variants={fadeInUp}>
              <Card className="overflow-hidden border-2 border-blue-200">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {teacherData.name?.charAt(0)?.toUpperCase() || "T"}
                      </div>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          {teacherData.name || "Memuat..."}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                          {teacherData.employeeId && (
                            <Badge variant="secondary" className="gap-1">
                              <User className="h-3 w-3" />
                              NIP: {teacherData.employeeId}
                            </Badge>
                          )}
                          {teacherData.subjects.length > 0 && (
                            <Badge className="gap-1 bg-blue-500">
                              <GraduationCap className="h-3 w-3" />
                              {teacherData.subjects.join(", ")}
                            </Badge>
                          )}
                          {teacherData.schoolName && (
                            <Badge variant="outline" className="gap-1">
                              <Building2 className="h-3 w-3" />
                              {teacherData.schoolName}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {teacherData.bio && (
                        <p className="text-sm text-gray-600 max-w-2xl">
                          {teacherData.bio}
                        </p>
                      )}
                    </div>

                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => isEditing ? handleSaveProfile() : handleEditProfile()}
                      className="self-start"
                    >
                      {isEditing ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Simpan
                        </>
                      ) : (
                        <>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit Profil
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Siswa</p>
                        <p className="text-2xl font-bold text-blue-600">{teacherStats.totalStudents}</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Kelas Aktif</p>
                        <p className="text-2xl font-bold text-green-600">{teacherStats.activeClasses}</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <BookOpen className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Materi Dibuat</p>
                        <p className="text-2xl font-bold text-purple-600">{teacherStats.materialsCreated}</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Sparkles className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Rata-rata Kelas</p>
                        <p className="text-2xl font-bold text-amber-600">{teacherStats.averageScore}%</p>
                      </div>
                      <div className="p-3 bg-amber-100 rounded-full">
                        <TrendingUp className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Tabs */}
            <motion.div variants={fadeInUp}>
              <Tabs defaultValue="info" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">
                    <User className="h-4 w-4 mr-2" />
                    Informasi
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <Shield className="h-4 w-4 mr-2" />
                    Keamanan
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Bell className="h-4 w-4 mr-2" />
                    Pengaturan
                  </TabsTrigger>
                </TabsList>

                {/* Info Tab */}
                <TabsContent value="info" className="space-y-4">
                  <Card ref={infoSectionRef}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Informasi Pribadi
                      </CardTitle>
                      <CardDescription>Kelola data diri dan informasi kontak Anda</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Nama Lengkap
                          </Label>
                          <Input
                            id="name"
                            value={teacherData.name}
                            onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                            disabled={!isEditing}
                            className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={teacherData.email}
                            disabled
                            className="bg-muted"
                          />
                          <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Nomor Telepon
                          </Label>
                          <Input
                            id="phone"
                            value={teacherData.phone}
                            onChange={(e) => setTeacherData({ ...teacherData, phone: e.target.value })}
                            disabled={!isEditing}
                            placeholder="08xx xxxx xxxx"
                            className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="employeeId" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            NIP
                          </Label>
                          <Input
                            id="employeeId"
                            value={teacherData.employeeId}
                            onChange={(e) => setTeacherData({ ...teacherData, employeeId: e.target.value })}
                            disabled={!isEditing}
                            className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="qualification" className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Kualifikasi
                          </Label>
                          <Input
                            id="qualification"
                            value={teacherData.qualification}
                            onChange={(e) => setTeacherData({ ...teacherData, qualification: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Contoh: S1 Pendidikan Matematika"
                            className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Sekolah
                          </Label>
                          <Input
                            value={teacherData.schoolName}
                            disabled
                            className="bg-muted"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Alamat
                          </Label>
                          <Input
                            id="address"
                            value={teacherData.address}
                            onChange={(e) => setTeacherData({ ...teacherData, address: e.target.value })}
                            disabled={!isEditing}
                            placeholder="Alamat lengkap"
                            className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subjects" className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Mata Pelajaran yang Diampu
                        </Label>
                        <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/50">
                          {teacherData.subjects.length > 0 ? (
                            teacherData.subjects.map((subject, idx) => (
                              <Badge key={idx} variant="secondary" className="text-sm">
                                {subject}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">Belum ada mata pelajaran yang ditugaskan</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={teacherData.bio}
                          onChange={(e) => setTeacherData({ ...teacherData, bio: e.target.value })}
                          disabled={!isEditing}
                          placeholder="Ceritakan tentang diri Anda sebagai pendidik..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Keamanan Akun
                      </CardTitle>
                      <CardDescription>Ubah password untuk menjaga keamanan akun Anda</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Password Saat Ini
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          placeholder="Masukkan password saat ini"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="flex items-center gap-2">
                          <KeyRound className="h-4 w-4" />
                          Password Baru
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Masukkan password baru (min. 6 karakter)"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Konfirmasi Password Baru
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Ulangi password baru"
                        />
                      </div>

                      <Button 
                        onClick={handlePasswordChange}
                        className="w-full"
                        disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Ubah Password
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-blue-600" />
                        Notifikasi
                      </CardTitle>
                      <CardDescription>Kelola preferensi notifikasi dan alert</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between py-3 border-b">
                        <div className="space-y-1">
                          <p className="font-medium">Notifikasi Email</p>
                          <p className="text-sm text-muted-foreground">Terima update dan pemberitahuan melalui email</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b">
                        <div className="space-y-1">
                          <p className="font-medium">Alert Siswa Berisiko</p>
                          <p className="text-sm text-muted-foreground">Notifikasi ketika ada siswa yang butuh perhatian khusus</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b">
                        <div className="space-y-1">
                          <p className="font-medium">Laporan Mingguan</p>
                          <p className="text-sm text-muted-foreground">Ringkasan progress siswa setiap minggu</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between py-3">
                        <div className="space-y-1">
                          <p className="font-medium">Pengingat Tugas</p>
                          <p className="text-sm text-muted-foreground">Notifikasi untuk tugas yang perlu direview</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Volume2 className="h-5 w-5 text-blue-600" />
                        Audio & Suara
                      </CardTitle>
                      <CardDescription>Atur efek suara dan volume sistem</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">Efek Suara</p>
                          <p className="text-sm text-muted-foreground">Aktifkan efek suara untuk interaksi sistem</p>
                        </div>
                        <Switch checked={soundEnabled} onCheckedChange={handleSoundToggle} />
                      </div>
                      
                      {soundEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 pt-4 border-t"
                        >
                          <div className="flex items-center justify-between">
                            <Label className="font-medium">Volume</Label>
                            <span className="text-sm font-semibold text-blue-600">{Math.round(soundVolume)}%</span>
                          </div>
                          <Slider
                            value={[soundVolume]}
                            onValueChange={handleVolumeChange}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground">Geser untuk mengatur volume efek suara</p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-red-50/50">
                    <CardHeader>
                      <CardTitle className="text-red-600 flex items-center gap-2">
                        <LogOut className="h-5 w-5" />
                        Keluar dari Akun
                      </CardTitle>
                      <CardDescription>Logout dari platform EduSmart</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="destructive" 
                        onClick={handleLogout}
                        className="w-full"
                        size="lg"
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
          )}
        </div>
      </main>
      </div>
    </SidebarProvider>
  );
};

export default TeacherProfile;
