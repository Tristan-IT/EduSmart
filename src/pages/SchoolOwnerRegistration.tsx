import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Building2, Mail, Lock, User, MapPin, Phone, CheckCircle2, Copy, Users, BarChart3, Shield, School, GraduationCap, Plus, X, ChevronDown, Check } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const SchoolOwnerRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [generatedSchoolId, setGeneratedSchoolId] = useState("");
  const [copiedSchoolId, setCopiedSchoolId] = useState(false);

  // Owner Info
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // School Info
  const [schoolName, setSchoolName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [phone, setPhone] = useState("");

  // School Type Configuration
  const [schoolType, setSchoolType] = useState<"SD" | "SMP" | "SMA" | "SMK" | "">("");
  const [schoolTypes, setSchoolTypes] = useState<Array<"SD" | "SMP" | "SMA" | "SMK">>([]);
  const [schoolTypesOpen, setSchoolTypesOpen] = useState(false);
  const [smaSpecializations, setSmaSpecializations] = useState<string[]>([]);
  const [smkMajors, setSmkMajors] = useState<Array<{ code: string; name: string; description: string }>>([]);
  const [newMajorCode, setNewMajorCode] = useState("");
  const [newMajorName, setNewMajorName] = useState("");
  const [newMajorDesc, setNewMajorDesc] = useState("");

  const availableSpecializations = ["IPA", "IPS", "Bahasa"];
  const availableSchoolTypes = [
    { value: "SD", label: "SD (Sekolah Dasar)" },
    { value: "SMP", label: "SMP (Sekolah Menengah Pertama)" },
    { value: "SMA", label: "SMA (Sekolah Menengah Atas)" },
    { value: "SMK", label: "SMK (Sekolah Menengah Kejuruan)" },
  ];

  const toggleSchoolType = (type: "SD" | "SMP" | "SMA" | "SMK") => {
    setSchoolTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleSpecialization = (spec: string) => {
    setSmaSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const addMajor = () => {
    if (newMajorCode && newMajorName) {
      setSmkMajors([...smkMajors, {
        code: newMajorCode.toUpperCase(),
        name: newMajorName,
        description: newMajorDesc || "",
      }]);
      setNewMajorCode("");
      setNewMajorName("");
      setNewMajorDesc("");
    }
  };

  const removeMajor = (code: string) => {
    setSmkMajors(smkMajors.filter((m) => m.code !== code));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (ownerPassword !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (ownerPassword.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (!schoolName || !ownerName || !ownerEmail || !address || !city || !province) {
      setError("Harap isi semua field yang wajib");
      return;
    }

    if (schoolTypes.length === 0) {
      setError("Harap pilih minimal 1 jenis sekolah");
      return;
    }

    if (schoolTypes.includes("SMA") && smaSpecializations.length === 0) {
      setError("Harap pilih minimal 1 peminatan untuk SMA");
      return;
    }

    if (schoolTypes.includes("SMK") && smkMajors.length === 0) {
      setError("Harap tambahkan minimal 1 jurusan untuk SMK");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/school-owner/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Owner data
          name: ownerName,
          email: ownerEmail,
          password: ownerPassword,
          // School data
          schoolName,
          address,
          city,
          province,
          phone: phone || undefined,
          // School type configuration
          schoolTypes,
          smaSpecializations: schoolTypes.includes("SMA") ? smaSpecializations : undefined,
          smkMajors: schoolTypes.includes("SMK") ? smkMajors : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      // Success - show dialog with School ID
      setGeneratedSchoolId(data.data.school.schoolId);
      setShowSuccessDialog(true);

      // Store token
      if (data.data.token) {
        localStorage.setItem("token", data.data.token);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  };

  const copySchoolId = () => {
    navigator.clipboard.writeText(generatedSchoolId);
    setCopiedSchoolId(true);
    setTimeout(() => setCopiedSchoolId(false), 2000);
  };

  const handleSuccessClose = () => {
    // Store School ID for API calls
    localStorage.setItem("schoolId", generatedSchoolId);
    setShowSuccessDialog(false);
    // Redirect to school owner dashboard
    navigate("/school-owner-dashboard");
  };

  return (
    <>
      <Navbar role="guest" activeRoute="/school-owner-registration" />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <motion.div 
          className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative container mx-auto px-4 py-16 md:py-24">
            <motion.div className="max-w-4xl mx-auto text-center" variants={fadeInUp}>
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                  <Building2 className="h-16 w-16" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Daftar Sekolah Anda
              </h1>
              
              <p className="text-lg md:text-xl text-indigo-50 mb-12 max-w-2xl mx-auto">
                Kelola seluruh ekosistem sekolah dengan platform manajemen pembelajaran yang komprehensif
              </p>

              {/* Feature Highlights */}
              <motion.div 
                className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto"
                variants={staggerContainer}
              >
                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  variants={fadeInUp}
                >
                  <Users className="h-10 w-10 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Multi-Kelas</h3>
                  <p className="text-sm text-indigo-50">
                    Kelola semua kelas dan guru dalam satu platform terpadu
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  variants={fadeInUp}
                >
                  <BarChart3 className="h-10 w-10 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Laporan Lengkap</h3>
                  <p className="text-sm text-indigo-50">
                    Dashboard analitik menyeluruh untuk semua kelas dan siswa
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  variants={fadeInUp}
                >
                  <Shield className="h-10 w-10 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Pengawasan Penuh</h3>
                  <p className="text-sm text-indigo-50">
                    Kontrol akses dan monitor aktivitas seluruh guru
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Registration Form */}
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-4xl mx-auto shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Form Registrasi Sekolah</CardTitle>
                <CardDescription>
                  Daftar sebagai School Owner untuk mengelola sekolah Anda
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Owner Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5 text-indigo-600" />
                      Informasi Owner
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ownerName">
                          Nama Lengkap <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="ownerName"
                            type="text"
                            placeholder="John Doe"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ownerEmail">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="ownerEmail"
                            type="email"
                            placeholder="owner@sekolah.com"
                            value={ownerEmail}
                            onChange={(e) => setOwnerEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ownerPassword">
                          Password <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="ownerPassword"
                            type="password"
                            placeholder="Minimal 6 karakter"
                            value={ownerPassword}
                            onChange={(e) => setOwnerPassword(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Konfirmasi Password <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Ulangi password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* School Information */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-indigo-600" />
                      Informasi Sekolah
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="schoolName">
                          Nama Sekolah <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="schoolName"
                            type="text"
                            placeholder="SMA Negeri 1 Jakarta"
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">
                          Alamat Lengkap <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="address"
                            type="text"
                            placeholder="Jl. Pendidikan No. 123"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">
                          Kota/Kabupaten <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="Jakarta"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="province">
                          Provinsi <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="province"
                          type="text"
                          placeholder="DKI Jakarta"
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon Sekolah</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="021-12345678"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="schoolType">
                          Jenis Sekolah <span className="text-destructive">*</span>
                        </Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Pilih jenjang pendidikan yang tersedia di sekolah Anda (bisa lebih dari satu)
                        </p>
                        
                        <Popover open={schoolTypesOpen} onOpenChange={setSchoolTypesOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={schoolTypesOpen}
                              className="w-full justify-between h-auto min-h-[42px] hover:bg-gray-50"
                            >
                              <div className="flex flex-wrap gap-1.5 flex-1">
                                {schoolTypes.length > 0 ? (
                                  schoolTypes.map((type) => (
                                    <Badge
                                      key={type}
                                      variant="secondary"
                                      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100"
                                    >
                                      {type}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-muted-foreground font-normal">
                                    Pilih jenjang sekolah...
                                  </span>
                                )}
                              </div>
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandGroup>
                                {availableSchoolTypes.map((type) => (
                                  <CommandItem
                                    key={type.value}
                                    onSelect={() => toggleSchoolType(type.value as any)}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <div
                                      className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                                        schoolTypes.includes(type.value as any)
                                          ? "bg-primary text-primary-foreground"
                                          : "opacity-50 [&_svg]:invisible"
                                      }`}
                                    >
                                      <Check className="h-3 w-3" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium">{type.label}</div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        
                        {schoolTypes.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {schoolTypes.length} jenjang dipilih
                          </p>
                        )}
                      </div>
                    </div>

                    {/* SMA Specializations */}
                    {schoolTypes.includes("SMA") && (
                      <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Label className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Peminatan yang Tersedia <span className="text-destructive">*</span>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Pilih peminatan yang akan tersedia di sekolah SMA Anda
                        </p>
                        <div className="flex flex-wrap gap-4">
                          {availableSpecializations.map((spec) => (
                            <div key={spec} className="flex items-center space-x-2">
                              <Checkbox
                                id={`spec-${spec}`}
                                checked={smaSpecializations.includes(spec)}
                                onCheckedChange={() => toggleSpecialization(spec)}
                              />
                              <label
                                htmlFor={`spec-${spec}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {spec}
                              </label>
                            </div>
                          ))}
                        </div>
                        {smaSpecializations.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {smaSpecializations.map((spec) => (
                              <span
                                key={spec}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* SMK Majors */}
                    {schoolTypes.includes("SMK") && (
                      <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <Label className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Jurusan yang Tersedia <span className="text-destructive">*</span>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Tambahkan jurusan yang tersedia di sekolah SMK Anda
                        </p>

                        {/* Add Major Form */}
                        <div className="grid grid-cols-1 gap-3 p-3 bg-white rounded-lg border">
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Kode (contoh: PPLG)"
                              value={newMajorCode}
                              onChange={(e) => setNewMajorCode(e.target.value)}
                            />
                            <Input
                              placeholder="Nama Jurusan"
                              value={newMajorName}
                              onChange={(e) => setNewMajorName(e.target.value)}
                            />
                          </div>
                          <Input
                            placeholder="Deskripsi (opsional)"
                            value={newMajorDesc}
                            onChange={(e) => setNewMajorDesc(e.target.value)}
                          />
                          <Button
                            type="button"
                            onClick={addMajor}
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={!newMajorCode || !newMajorName}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Jurusan
                          </Button>
                        </div>

                        {/* List of Majors */}
                        {smkMajors.length > 0 && (
                          <div className="space-y-2">
                            {smkMajors.map((major) => (
                              <div
                                key={major.code}
                                className="flex items-start justify-between p-3 bg-white rounded-lg border"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-mono font-bold">
                                      {major.code}
                                    </span>
                                    <span className="font-semibold">{major.name}</span>
                                  </div>
                                  {major.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {major.description}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeMajor(major.code)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate("/login")}
                    >
                      Batal
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700" 
                      disabled={loading}
                    >
                      {loading ? "Memproses..." : "Daftar Sekolah"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Registrasi Berhasil! 🎉
            </DialogTitle>
            <DialogDescription className="text-center">
              Sekolah Anda telah terdaftar. Berikut adalah School ID yang dapat dibagikan ke guru:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-2">School ID:</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-blue-600">{generatedSchoolId}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copySchoolId}
                  className="ml-2"
                >
                  {copiedSchoolId ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                <strong>Penting:</strong> Bagikan School ID ini kepada guru-guru Anda agar mereka dapat mendaftar dan bergabung dengan sekolah.
              </AlertDescription>
            </Alert>

            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleSuccessClose}>
              Lanjut ke Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default SchoolOwnerRegistration;
