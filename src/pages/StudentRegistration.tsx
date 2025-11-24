import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Lock, User, Hash, Phone, BookMarked, GraduationCap, CheckCircle2, Sparkles, ArrowRight, Brain, Trophy } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validatingClass, setValidatingClass] = useState(false);
  const [classValid, setClassValid] = useState(false);
  const [classInfo, setClassInfo] = useState<{
    name: string;
    capacity: number;
    currentStudents: number;
  } | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  const validateClassId = async (id: string) => {
    if (!id || id.length < 8) {
      setClassValid(false);
      setClassInfo(null);
      return;
    }

    setValidatingClass(true);
    try {
      // Call API to validate class ID
      const response = await fetch(`http://localhost:5000/api/student-registration/validate/${id}`);
      const data = await response.json();

      if (response.ok && data.success && data.data) {
        setClassValid(true);
        setClassInfo({
          name: data.data.displayName || data.data.className || "Kelas",
          capacity: data.data.maxStudents || 40,
          currentStudents: data.data.currentStudents || 0,
        });
      } else {
        setClassValid(false);
        setClassInfo(null);
      }
    } catch (err) {
      setClassValid(false);
      setClassInfo(null);
    } finally {
      setValidatingClass(false);
    }
  };

  const handleClassIdChange = (value: string) => {
    setClassId(value);
    validateClassId(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (!classValid) {
      setError("Class ID tidak valid");
      return;
    }

    if (classInfo && classInfo.currentStudents >= classInfo.capacity) {
      setError("Kelas sudah penuh. Silakan hubungi admin sekolah.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/student-registration/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          classId,
          rollNumber: rollNumber || 1,
          parentName: parentName || undefined,
          parentPhone: parentPhone || undefined,
          parentEmail: parentEmail || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      // Success - login to AuthContext
      if (data.token && data.user) {
        login({
          token: data.token,
          user: {
            id: data.user.id || data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            className: data.user.className,
            school: data.user.school,
          },
        });

        // Redirect to student dashboard
        navigate("/student-dashboard");
      } else {
        throw new Error("Token atau user data tidak ditemukan");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar role="guest" activeRoute="/student-registration" onRegisterClick={() => navigate('/')} />

      <main className="flex-1 relative overflow-hidden">
        {/* Hero Background Section */}
        <div className="relative bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 border-b">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" 
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
              className="absolute top-1/2 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" 
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>

          <div className="container mx-auto px-4 py-16 relative z-10">
            <motion.div
              className="max-w-3xl mx-auto text-center space-y-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={scaleIn}>
                <div className="inline-flex p-4 bg-gradient-to-br from-primary to-purple-600 rounded-2xl shadow-2xl mb-4">
                  <GraduationCap className="h-12 w-12 text-primary-foreground" />
                </div>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-6xl font-bold"
              >
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Mulai Perjalanan Belajarmu
                </span>
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                Bergabunglah dengan ribuan siswa yang sudah merasakan pembelajaran adaptif berbasis AI
              </motion.p>

              {/* Benefits */}
              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8"
              >
                {[
                  { icon: Brain, label: "Pembelajaran Adaptif", desc: "Materi menyesuaikan kemampuan" },
                  { icon: Trophy, label: "Gamifikasi Seru", desc: "Raih achievement & rewards" },
                  { icon: Sparkles, label: "AI Assistant", desc: "Bantuan belajar 24/7" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="flex items-center gap-3 p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Form Section */}
        <div className="container mx-auto px-4 py-12">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-2xl border-2 backdrop-blur-sm bg-card/95">
              <CardHeader className="space-y-3 pb-6 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">Formulir Pendaftaran Siswa</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Lengkapi data di bawah untuk membuat akun siswa
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="hidden md:flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3" />
                    Gratis selamanya
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-8"
>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <Alert variant="destructive" className="border-2">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Class ID Section - Enhanced */}
                  <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5 border-2 border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-bold">Class ID</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Masukkan Class ID yang diberikan oleh wali kelas atau admin sekolah Anda
                    </p>
                    <Input
                      id="classId"
                      type="text"
                      placeholder="Contoh: CLS-00001"
                      value={classId}
                      onChange={(e) => handleClassIdChange(e.target.value)}
                      className="h-12 border-2 focus-visible:ring-2 text-base font-mono"
                      required
                    />
                    {validatingClass && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4 animate-spin" />
                        Memvalidasi Class ID...
                      </div>
                    )}
                    {classValid && classInfo && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3 p-4 rounded-lg bg-primary/10 border border-primary/30"
                      >
                        <div className="flex items-center gap-2 text-primary font-semibold">
                          <CheckCircle2 className="h-5 w-5" />
                          Kelas ditemukan: {classInfo.name}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="bg-background">
                            Kapasitas: {classInfo.currentStudents}/{classInfo.capacity} siswa
                          </Badge>
                          {classInfo.currentStudents >= classInfo.capacity ? (
                            <Badge variant="destructive">
                              Kelas Penuh
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500/10 text-green-700 border-green-500/30">
                              Tersedia {classInfo.capacity - classInfo.currentStudents} slot
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    )}
                    {classId && !classValid && !validatingClass && (
                      <div className="flex items-center gap-2 text-sm text-destructive p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                        <span className="font-semibold">⚠</span>
                        Class ID tidak valid. Pastikan Anda memasukkan kode yang benar atau hubungi wali kelas Anda.
                      </div>
                    )}
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-bold">Informasi Pribadi</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                          Nama Lengkap <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Masukkan nama lengkap"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-11 border-2 focus-visible:ring-2"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rollNumber" className="text-sm font-semibold flex items-center gap-2">
                          <Hash className="h-4 w-4 text-primary" />
                          NIS (Nomor Induk Siswa) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="rollNumber"
                          type="number"
                          min="1"
                          max="9999"
                          placeholder="Contoh: 12345"
                          value={rollNumber}
                          onChange={(e) => setRollNumber(e.target.value)}
                          className="h-11 border-2 focus-visible:ring-2"
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="student@school.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-11 border-2 focus-visible:ring-2"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                          <Lock className="h-4 w-4 text-primary" />
                          Password <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Minimal 6 karakter"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-11 border-2 focus-visible:ring-2"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                          Konfirmasi Password <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Ulangi password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-11 border-2 focus-visible:ring-2"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Parent Information */}
                  <div className="space-y-5 pt-4 border-t">
                    <div className="flex items-center gap-2 pb-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-bold">Informasi Orang Tua / Wali</h3>
                    </div>
                    <p className="text-sm text-muted-foreground -mt-2">
                      Informasi ini membantu kami menghubungi orang tua untuk laporan perkembangan
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="parentName" className="text-sm font-semibold">
                          Nama Orang Tua / Wali <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="parentName"
                          type="text"
                          placeholder="Nama lengkap orang tua"
                          value={parentName}
                          onChange={(e) => setParentName(e.target.value)}
                          className="h-11 border-2 focus-visible:ring-2"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parentPhone" className="text-sm font-semibold flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          Nomor Telepon <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="parentPhone"
                          type="tel"
                          placeholder="08123456789"
                          value={parentPhone}
                          onChange={(e) => setParentPhone(e.target.value)}
                          className="h-11 border-2 focus-visible:ring-2"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parentEmail" className="text-sm font-semibold flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          Email Orang Tua <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="parentEmail"
                          type="email"
                          placeholder="parent@email.com"
                          value={parentEmail}
                          onChange={(e) => setParentEmail(e.target.value)}
                          className="h-11 border-2 focus-visible:ring-2"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col gap-4 pt-6 border-t">
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:opacity-90 transition-opacity shadow-xl"
                      disabled={
                        loading ||
                        !classValid ||
                        (classInfo !== null && classInfo.currentStudents >= classInfo.capacity)
                      }
                    >
                      {loading ? (
                        <>
                          <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          Daftar Sekarang
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Sudah punya akun?{" "}
                      <Link to="/login" className="font-semibold text-primary hover:underline">
                        Masuk di sini
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentRegistration;
