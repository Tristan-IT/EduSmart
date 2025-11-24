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
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Building2, 
  Calendar, 
  Shield, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  Bell,
  Users,
  BookOpen,
  Award,
  Clock,
  Save,
  AlertCircle,
  Palette,
  Database,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const SchoolOwnerSettings = () => {
  const [schoolData, setSchoolData] = useState({
    schoolName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    academicYear: "2024/2025",
    description: "",
    motto: "",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    teacherRegistration: true,
    studentProgress: true,
    systemUpdates: false,
    weeklyReport: true,
  });
  
  const [academicSettings, setAcademicSettings] = useState({
    gradeSystem: "100",
    minimumPassGrade: "75",
    attendanceRequired: "75",
    maxClassSize: "40",
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSchoolData();
  }, []);

  const fetchSchoolData = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem("token");
      let schoolId = localStorage.getItem("schoolId");
      
      if (!schoolId) {
        // Fallback: get from user profile
        const userResponse = await fetch("http://localhost:5000/api/school-owner/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          schoolId = userData.schoolId;
        }
      }
      
      if (!schoolId) {
        setError("School ID tidak ditemukan. Silakan login kembali.");
        return;
      }
      
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
      let schoolId = localStorage.getItem("schoolId");
      
      if (!schoolId) {
        // Fallback: get from user profile
        const userResponse = await fetch("http://localhost:5000/api/school-owner/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          schoolId = userData.schoolId;
        }
      }
      
      if (!schoolId) {
        setError("School ID tidak ditemukan. Silakan login kembali.");
        return;
      }
      
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

          <div className="p-6 max-w-7xl mx-auto">
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

              {fetchLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Memuat data sekolah...</p>
                </div>
              ) : (
                <Tabs defaultValue="general" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                    <TabsTrigger value="general" className="gap-2">
                      <Building2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Informasi</span>
                    </TabsTrigger>
                    <TabsTrigger value="academic" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">Akademik</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                      <Bell className="h-4 w-4" />
                      <span className="hidden sm:inline">Notifikasi</span>
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="gap-2">
                      <Palette className="h-4 w-4" />
                      <span className="hidden sm:inline">Tampilan</span>
                    </TabsTrigger>
                    <TabsTrigger value="data" className="gap-2">
                      <Database className="h-4 w-4" />
                      <span className="hidden sm:inline">Data</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* General Tab */}
                  <TabsContent value="general" className="space-y-6">
                    <motion.div variants={fadeInUp}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-violet-600" />
                            Identitas Sekolah
                          </CardTitle>
                          <CardDescription>
                            Informasi dasar dan identitas sekolah Anda
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="schoolName" className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-gray-500" />
                                Nama Sekolah <span className="text-red-500">*</span>
                              </Label>
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
                              <Label htmlFor="website" className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-gray-500" />
                                Website
                              </Label>
                              <Input
                                id="website"
                                value={schoolData.website}
                                onChange={(e) =>
                                  setSchoolData({ ...schoolData, website: e.target.value })
                                }
                                placeholder="https://sekolah.sch.id"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="motto" className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-gray-500" />
                              Moto Sekolah
                            </Label>
                            <Input
                              id="motto"
                              value={schoolData.motto}
                              onChange={(e) =>
                                setSchoolData({ ...schoolData, motto: e.target.value })
                              }
                              placeholder="Cerdas, Kreatif, dan Berakhlak Mulia"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi Sekolah</Label>
                            <Textarea
                              id="description"
                              value={schoolData.description}
                              onChange={(e) =>
                                setSchoolData({ ...schoolData, description: e.target.value })
                              }
                              placeholder="Ceritakan tentang sekolah Anda..."
                              rows={4}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-blue-600" />
                            Informasi Kontak
                          </CardTitle>
                          <CardDescription>
                            Detail kontak untuk komunikasi eksternal
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                Email Sekolah
                              </Label>
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
                              <Label htmlFor="phone" className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                No. Telepon
                              </Label>
                              <Input
                                id="phone"
                                value={schoolData.phone}
                                onChange={(e) =>
                                  setSchoolData({ ...schoolData, phone: e.target.value })
                                }
                                placeholder="021-xxxxxxxx"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-red-600" />
                            Alamat Lengkap
                          </CardTitle>
                          <CardDescription>
                            Lokasi fisik sekolah
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="address">Jalan dan Nomor</Label>
                            <Input
                              id="address"
                              value={schoolData.address}
                              onChange={(e) =>
                                setSchoolData({ ...schoolData, address: e.target.value })
                              }
                              placeholder="Jl. Pendidikan No. 123"
                            />
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
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

                          <Separator />

                          <Button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-purple-600"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Menyimpan..." : "Simpan Semua Perubahan"}
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
                            <Calendar className="h-5 w-5 text-orange-600" />
                            Tahun Ajaran
                          </CardTitle>
                          <CardDescription>
                            Periode akademik saat ini
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="academicYear">Tahun Ajaran Aktif</Label>
                              <Input
                                id="academicYear"
                                value={schoolData.academicYear}
                                onChange={(e) =>
                                  setSchoolData({ ...schoolData, academicYear: e.target.value })
                                }
                                placeholder="2024/2025"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-green-50">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">Aktif</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            Sistem Penilaian
                          </CardTitle>
                          <CardDescription>
                            Konfigurasi standar penilaian dan kelulusan
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="gradeSystem">Skala Nilai</Label>
                              <Select 
                                value={academicSettings.gradeSystem}
                                onValueChange={(value) =>
                                  setAcademicSettings({ ...academicSettings, gradeSystem: value })
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
                              <Label htmlFor="minimumPassGrade">Nilai Minimum Kelulusan</Label>
                              <Input
                                id="minimumPassGrade"
                                value={academicSettings.minimumPassGrade}
                                onChange={(e) =>
                                  setAcademicSettings({ ...academicSettings, minimumPassGrade: e.target.value })
                                }
                                placeholder="75"
                              />
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="attendanceRequired">Minimum Kehadiran (%)</Label>
                              <Input
                                id="attendanceRequired"
                                value={academicSettings.attendanceRequired}
                                onChange={(e) =>
                                  setAcademicSettings({ ...academicSettings, attendanceRequired: e.target.value })
                                }
                                placeholder="75"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="maxClassSize">Maksimal Siswa Per Kelas</Label>
                              <Input
                                id="maxClassSize"
                                value={academicSettings.maxClassSize}
                                onChange={(e) =>
                                  setAcademicSettings({ ...academicSettings, maxClassSize: e.target.value })
                                }
                                placeholder="40"
                              />
                            </div>
                          </div>

                          <Separator />

                          <Button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="bg-gradient-to-r from-orange-600 to-red-600"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Menyimpan..." : "Simpan Pengaturan"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* Notifications Tab */}
                  <TabsContent value="notifications" className="space-y-6">
                    <motion.div variants={fadeInUp}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-yellow-600" />
                            Preferensi Notifikasi
                          </CardTitle>
                          <CardDescription>
                            Kelola notifikasi yang ingin Anda terima
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
                              <Label className="text-base">Pendaftaran Guru Baru</Label>
                              <p className="text-sm text-muted-foreground">
                                Notifikasi ketika guru baru mendaftar
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.teacherRegistration}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({ ...notificationSettings, teacherRegistration: checked })
                              }
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-base">Progress Siswa</Label>
                              <p className="text-sm text-muted-foreground">
                                Update pencapaian dan prestasi siswa
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
                              <Label className="text-base">Update Sistem</Label>
                              <p className="text-sm text-muted-foreground">
                                Informasi fitur baru dan perbaikan
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.systemUpdates}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({ ...notificationSettings, systemUpdates: checked })
                              }
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-base">Laporan Mingguan</Label>
                              <p className="text-sm text-muted-foreground">
                                Ringkasan aktivitas sekolah setiap minggu
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.weeklyReport}
                              onCheckedChange={(checked) =>
                                setNotificationSettings({ ...notificationSettings, weeklyReport: checked })
                              }
                            />
                          </div>

                          <Separator />

                          <Button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="bg-gradient-to-r from-yellow-600 to-orange-600"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Menyimpan..." : "Simpan Preferensi"}
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
                            <Palette className="h-5 w-5 text-pink-600" />
                            Tampilan Interface
                          </CardTitle>
                          <CardDescription>
                            Kustomisasi tampilan dashboard
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Alert className="bg-blue-50 border-blue-200">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-800">
                              Fitur kustomisasi tema akan segera tersedia. Anda akan dapat mengubah warna, font, dan layout dashboard.
                            </AlertDescription>
                          </Alert>
                          
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-6 border-2 border-dashed rounded-lg text-center">
                              <Palette className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                              <p className="text-sm font-medium">Theme Color</p>
                              <p className="text-xs text-muted-foreground mt-1">Coming Soon</p>
                            </div>
                            <div className="p-6 border-2 border-dashed rounded-lg text-center">
                              <Eye className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                              <p className="text-sm font-medium">Dark Mode</p>
                              <p className="text-xs text-muted-foreground mt-1">Coming Soon</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* Data Tab */}
                  <TabsContent value="data" className="space-y-6">
                    <motion.div variants={fadeInUp}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-green-600" />
                            Manajemen Data
                          </CardTitle>
                          <CardDescription>
                            Backup, restore, dan ekspor data sekolah
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="space-y-1">
                                <p className="font-medium">Backup Data</p>
                                <p className="text-sm text-muted-foreground">
                                  Buat salinan cadangan data sekolah
                                </p>
                              </div>
                              <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Backup
                              </Button>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="space-y-1">
                                <p className="font-medium">Restore Data</p>
                                <p className="text-sm text-muted-foreground">
                                  Pulihkan data dari backup sebelumnya
                                </p>
                              </div>
                              <Button variant="outline">
                                <Upload className="h-4 w-4 mr-2" />
                                Restore
                              </Button>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="space-y-1">
                                <p className="font-medium">Export Data</p>
                                <p className="text-sm text-muted-foreground">
                                  Ekspor semua data ke format Excel/CSV
                                </p>
                              </div>
                              <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                              </Button>
                            </div>
                          </div>

                          <Separator />

                          <Alert variant="destructive" className="bg-red-50 border-red-200">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              <strong className="font-semibold">Zona Bahaya</strong>
                              <p className="text-sm mt-2">
                                Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan. Pastikan Anda telah membuat backup sebelum melanjutkan.
                              </p>
                            </AlertDescription>
                          </Alert>

                          <div className="flex items-center justify-between p-4 border-2 border-red-200 rounded-lg bg-red-50">
                            <div className="space-y-1">
                              <p className="font-medium text-red-900">Hapus Semua Data</p>
                              <p className="text-sm text-red-700">
                                Menghapus seluruh data sekolah secara permanen
                              </p>
                            </div>
                            <Button variant="destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Hapus
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SchoolOwnerSettings;
