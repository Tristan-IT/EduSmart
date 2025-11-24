import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Lock, CheckCircle2, Building2, Users, BookOpen, Shield, Camera, Save, KeyRound } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const SchoolOwnerProfile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [schoolData, setSchoolData] = useState({
    schoolName: "",
    schoolId: "",
    totalTeachers: 0,
    totalStudents: 0,
    totalClasses: 0,
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:5000/api/school-owner/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData({
          ...profileData,
          name: data.name || "",
          email: data.email || "",
        });
        
        // Fetch school data
        if (data.schoolId) {
          const schoolResponse = await fetch(
            `http://localhost:5000/api/school-dashboard/overview?schoolId=${data.schoolId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          if (schoolResponse.ok) {
            const schoolInfo = await schoolResponse.json();
            setSchoolData({
              schoolName: schoolInfo.data?.school?.schoolName || "",
              schoolId: data.schoolId || "",
              totalTeachers: schoolInfo.data?.stats?.totalTeachers || 0,
              totalStudents: schoolInfo.data?.stats?.totalStudents || 0,
              totalClasses: schoolInfo.data?.stats?.totalClasses || 0,
            });
          }
        }
      }
    } catch (err: any) {
      setError("Gagal memuat profil");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:5000/api/school-owner/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess("Profil berhasil diperbarui!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setError("");

    if (profileData.newPassword !== profileData.confirmPassword) {
      setError("Password baru dan konfirmasi tidak cocok");
      setLoading(false);
      return;
    }

    if (profileData.newPassword.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:5000/api/school-owner/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to change password");
      }

      setSuccess("Password berhasil diubah!");
      setProfileData({
        ...profileData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
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
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Profil Saya
                </h1>
                <p className="text-sm text-muted-foreground">
                  Kelola informasi akun pribadi Anda
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
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {fetchLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Memuat profil...</p>
                </div>
              ) : (
                <>
                  {/* Profile Header Card with Avatar */}
                  <motion.div variants={fadeInUp}>
                    <Card className="border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50/30">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                              {profileData.name.charAt(0).toUpperCase() || "SO"}
                            </div>
                            <Button
                              size="icon"
                              className="absolute bottom-0 right-0 rounded-full w-8 h-8 bg-white border-2 border-blue-500 hover:bg-blue-50"
                              variant="ghost"
                            >
                              <Camera className="h-4 w-4 text-blue-600" />
                            </Button>
                          </div>

                          {/* User Info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <h2 className="text-2xl font-bold text-gray-900">
                                {profileData.name || "School Owner"}
                              </h2>
                              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
                                <Shield className="h-3 w-3 mr-1" />
                                Pemilik Sekolah
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{profileData.email}</span>
                            </div>
                            {schoolData.schoolName && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                <span className="font-medium">{schoolData.schoolName}</span>
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                  {schoolData.schoolId}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* School Stats */}
                  {schoolData.schoolName && (
                    <motion.div variants={fadeInUp}>
                      <div className="grid gap-4 md:grid-cols-3">
                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Total Guru
                                </p>
                                <p className="text-3xl font-bold text-blue-600">
                                  {schoolData.totalTeachers}
                                </p>
                              </div>
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-600" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Total Siswa
                                </p>
                                <p className="text-3xl font-bold text-green-600">
                                  {schoolData.totalStudents}
                                </p>
                              </div>
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-green-600" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  Total Kelas
                                </p>
                                <p className="text-3xl font-bold text-purple-600">
                                  {schoolData.totalClasses}
                                </p>
                              </div>
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-purple-600" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Profile Info */}
                    <motion.div variants={fadeInUp}>
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            Informasi Pribadi
                          </CardTitle>
                          <CardDescription>
                            Kelola data pribadi akun Anda
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              Nama Lengkap
                            </Label>
                            <Input
                              id="name"
                              value={profileData.name}
                              onChange={(e) =>
                                setProfileData({ ...profileData, name: e.target.value })
                              }
                              placeholder="Masukkan nama lengkap"
                              className="border-gray-300 focus:border-blue-500"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) =>
                                setProfileData({ ...profileData, email: e.target.value })
                              }
                              placeholder="email@example.com"
                              className="border-gray-300 focus:border-blue-500"
                            />
                          </div>

                          <Separator />

                          <Button 
                            onClick={handleSaveProfile} 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Change Password */}
                    <motion.div variants={fadeInUp}>
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <KeyRound className="h-5 w-5 text-orange-600" />
                            Keamanan Akun
                          </CardTitle>
                          <CardDescription>
                            Ubah password untuk keamanan akun
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-gray-500" />
                              Password Saat Ini
                            </Label>
                            <Input
                              id="currentPassword"
                              type="password"
                              value={profileData.currentPassword}
                              onChange={(e) =>
                                setProfileData({ ...profileData, currentPassword: e.target.value })
                              }
                              placeholder="••••••••"
                              className="border-gray-300 focus:border-orange-500"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="newPassword" className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-gray-500" />
                              Password Baru
                            </Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={profileData.newPassword}
                              onChange={(e) =>
                                setProfileData({ ...profileData, newPassword: e.target.value })
                              }
                              placeholder="••••••••"
                              className="border-gray-300 focus:border-orange-500"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-gray-500" />
                              Konfirmasi Password Baru
                            </Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={profileData.confirmPassword}
                              onChange={(e) =>
                                setProfileData({ ...profileData, confirmPassword: e.target.value })
                              }
                              placeholder="••••••••"
                              className="border-gray-300 focus:border-orange-500"
                            />
                          </div>

                          <Alert className="bg-orange-50 border-orange-200">
                            <AlertDescription className="text-xs text-orange-800">
                              Password minimal 6 karakter. Gunakan kombinasi huruf, angka, dan simbol untuk keamanan maksimal.
                            </AlertDescription>
                          </Alert>

                          <Button 
                            onClick={handleChangePassword} 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                          >
                            <KeyRound className="h-4 w-4 mr-2" />
                            {loading ? "Mengubah..." : "Ubah Password"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SchoolOwnerProfile;
