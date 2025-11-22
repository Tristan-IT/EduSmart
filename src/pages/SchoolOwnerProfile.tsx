import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Lock, CheckCircle2 } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const SchoolOwnerProfile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [success, setSuccess] = useState(false);
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
      }
    } catch (err: any) {
      setError("Failed to load profile");
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

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
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

      setSuccess(true);
      setProfileData({
        ...profileData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <AppSidebar role="school-owner" />
        
        <main className="flex-1 overflow-auto">
          <motion.header
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur-xl shadow-sm"
          >
            <div className="flex h-20 items-center gap-4 px-8">
              <SidebarTrigger />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-indigo-600 font-semibold mb-1">Portal School Owner</p>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Profil Saya
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Kelola informasi akun pribadi Anda dengan aman
                </p>
              </div>
            </div>
          </motion.header>

          <div className="p-8 max-w-5xl mx-auto space-y-8">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-xl">
                  <User className="h-12 w-12 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{profileData.name || "Loading..."}</h2>
                  <div className="flex items-center gap-2 text-white/90">
                    <Mail className="h-4 w-4" />
                    <p className="text-sm">{profileData.email || "Loading..."}</p>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    School Owner Account
                  </div>
                </div>
              </div>
            </motion.div>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Alert className="bg-emerald-50 border-emerald-200 shadow-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <AlertDescription className="text-emerald-800 font-medium">
                    Profil berhasil diperbarui!
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert variant="destructive" className="shadow-lg">
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {fetchLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Memuat profil...</p>
              </div>
            ) : (
            <>
            {/* Profile Info */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <Card className="border-indigo-100 shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <CardHeader className="bg-gradient-to-br from-indigo-50/50 to-purple-50/30 pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 rounded-lg bg-indigo-100">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    Informasi Pribadi
                  </CardTitle>
                  <CardDescription className="text-base">
                    Update nama dan email Anda untuk personalisasi akun
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-base font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-indigo-500" />
                      Nama Lengkap
                    </Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      placeholder="Masukkan nama lengkap"
                      className="h-12 text-base border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4 text-indigo-500" />
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
                      className="h-12 text-base border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={loading}
                    className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Change Password */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
            >
              <Card className="border-purple-100 shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
                <CardHeader className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Lock className="h-6 w-6 text-purple-600" />
                    </div>
                    Ubah Password
                  </CardTitle>
                  <CardDescription className="text-base">
                    Pastikan akun Anda tetap aman dengan password yang kuat
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-3">
                    <Label htmlFor="currentPassword" className="text-base font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4 text-purple-500" />
                      Password Saat Ini
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) =>
                        setProfileData({ ...profileData, currentPassword: e.target.value })
                      }
                      placeholder="Masukkan password saat ini"
                      className="h-12 text-base border-purple-100 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="newPassword" className="text-base font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4 text-purple-500" />
                      Password Baru
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) =>
                        setProfileData({ ...profileData, newPassword: e.target.value })
                      }
                      placeholder="Masukkan password baru (min. 6 karakter)"
                      className="h-12 text-base border-purple-100 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-base font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-500" />
                      Konfirmasi Password Baru
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) =>
                        setProfileData({ ...profileData, confirmPassword: e.target.value })
                      }
                      placeholder="Konfirmasi password baru"
                      className="h-12 text-base border-purple-100 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-800">
                      <strong>Tips Keamanan:</strong> Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol untuk password yang lebih aman.
                    </p>
                  </div>
                  <Button 
                    onClick={handleChangePassword} 
                    disabled={loading}
                    className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? "Mengubah..." : "Ubah Password"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </>
          )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SchoolOwnerProfile;
