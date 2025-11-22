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

          <div className="p-6 max-w-4xl mx-auto space-y-6">
            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Profil berhasil diperbarui!
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {fetchLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">Memuat profil...</p>
              </div>
            ) : (
            <>
            {/* Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Pribadi
                </CardTitle>
                <CardDescription>
                  Update nama dan email Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                  />
                </div>
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Ubah Password
                </CardTitle>
                <CardDescription>
                  Pastikan akun Anda tetap aman
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Password Saat Ini</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={profileData.currentPassword}
                    onChange={(e) =>
                      setProfileData({ ...profileData, currentPassword: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) =>
                      setProfileData({ ...profileData, newPassword: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) =>
                      setProfileData({ ...profileData, confirmPassword: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleChangePassword} disabled={loading}>
                  {loading ? "Mengubah..." : "Ubah Password"}
                </Button>
              </CardContent>
            </Card>
          </>
          )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SchoolOwnerProfile;
