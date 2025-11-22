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
import { Settings, Building2, Calendar, Shield, CheckCircle2 } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const SchoolOwnerSettings = () => {
  const [schoolData, setSchoolData] = useState({
    schoolName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    academicYear: "2024/2025",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSchoolData();
  }, []);

  const fetchSchoolData = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem("token");
      const schoolId = localStorage.getItem("schoolId");
      
      const response = await fetch(`http://localhost:5000/api/school-owner/school/${schoolId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.school) {
          setSchoolData({
            schoolName: data.school.schoolName || "",
            email: data.school.email || "",
            phone: data.school.phone || "",
            address: data.school.address || "",
            city: data.school.city || "",
            province: data.school.province || "",
            postalCode: data.school.postalCode || "",
            academicYear: data.school.academicYear || "2024/2025",
          });
        }
      }
    } catch (err: any) {
      setError("Failed to load school data");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      const schoolId = localStorage.getItem("schoolId");
      
      const response = await fetch(`http://localhost:5000/api/school-owner/school/${schoolId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(schoolData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update school");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Pengaturan Sekolah
                </h1>
                <p className="text-sm text-muted-foreground">
                  Kelola konfigurasi dan preferensi sekolah
                </p>
              </div>
            </div>
          </motion.header>

          <div className="p-6">
            {success && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Pengaturan berhasil disimpan!
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {fetchLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">Memuat data sekolah...</p>
              </div>
            ) : (
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList>
                <TabsTrigger value="general" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Umum
                </TabsTrigger>
                <TabsTrigger value="academic" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Akademik
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Keamanan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Sekolah</CardTitle>
                    <CardDescription>
                      Data umum dan kontak sekolah
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="schoolName">Nama Sekolah</Label>
                        <Input
                          id="schoolName"
                          value={schoolData.schoolName}
                          onChange={(e) =>
                            setSchoolData({ ...schoolData, schoolName: e.target.value })
                          }
                          placeholder="SMA Negeri 1 Jakarta"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Sekolah</Label>
                        <Input
                          id="email"
                          type="email"
                          value={schoolData.email}
                          onChange={(e) =>
                            setSchoolData({ ...schoolData, email: e.target.value })
                          }
                          placeholder="info@sekolah.sch.id"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">No. Telepon</Label>
                        <Input
                          id="phone"
                          value={schoolData.phone}
                          onChange={(e) =>
                            setSchoolData({ ...schoolData, phone: e.target.value })
                          }
                          placeholder="021-xxxxxxxx"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Kode Pos</Label>
                        <Input
                          id="postalCode"
                          value={schoolData.postalCode}
                          onChange={(e) =>
                            setSchoolData({ ...schoolData, postalCode: e.target.value })
                          }
                          placeholder="12345"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Alamat Lengkap</Label>
                      <Input
                        id="address"
                        value={schoolData.address}
                        onChange={(e) =>
                          setSchoolData({ ...schoolData, address: e.target.value })
                        }
                        placeholder="Jl. Pendidikan No. 123"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">Kota/Kabupaten</Label>
                        <Input
                          id="city"
                          value={schoolData.city}
                          onChange={(e) =>
                            setSchoolData({ ...schoolData, city: e.target.value })
                          }
                          placeholder="Jakarta"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="province">Provinsi</Label>
                        <Input
                          id="province"
                          value={schoolData.province}
                          onChange={(e) =>
                            setSchoolData({ ...schoolData, province: e.target.value })
                          }
                          placeholder="DKI Jakarta"
                        />
                      </div>
                    </div>

                    <Button onClick={handleSave} disabled={loading}>
                      {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="academic">
                <Card>
                  <CardHeader>
                    <CardTitle>Pengaturan Akademik</CardTitle>
                    <CardDescription>
                      Konfigurasi tahun ajaran dan sistem penilaian
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="academicYear">Tahun Ajaran Aktif</Label>
                      <Input
                        id="academicYear"
                        value={schoolData.academicYear}
                        onChange={(e) =>
                          setSchoolData({ ...schoolData, academicYear: e.target.value })
                        }
                      />
                    </div>
                    <Button onClick={handleSave} disabled={loading}>
                      {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Keamanan & Privasi</CardTitle>
                    <CardDescription>
                      Pengaturan keamanan akun dan data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Fitur keamanan akan segera tersedia
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SchoolOwnerSettings;
