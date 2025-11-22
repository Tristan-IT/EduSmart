import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Mail, Lock, User, Building2, Hash, BookOpen, Award, X, Users, BarChart3, Target } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const TeacherRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validatingSchool, setValidatingSchool] = useState(false);
  const [schoolValid, setSchoolValid] = useState(false);
  const [schoolName, setSchoolName] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [phone, setPhone] = useState("");
  const [qualification, setQualification] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);

  const validateSchoolId = async (id: string) => {
    if (!id || id.length < 8) {
      setSchoolValid(false);
      setSchoolName("");
      return;
    }

    setValidatingSchool(true);
    try {
      // Mock validation - in real app, call API to validate
      // For now, accept any School ID starting with "SCH-"
      if (id.startsWith("SCH-")) {
        setSchoolValid(true);
        setSchoolName("Sekolah Contoh"); // Mock school name
      } else {
        setSchoolValid(false);
        setSchoolName("");
      }
    } catch (err) {
      setSchoolValid(false);
      setSchoolName("");
    } finally {
      setValidatingSchool(false);
    }
  };

  const handleSchoolIdChange = (value: string) => {
    setSchoolId(value);
    validateSchoolId(value);
  };

  const addSubject = () => {
    if (subjectInput.trim() && !subjects.includes(subjectInput.trim())) {
      setSubjects([...subjects, subjectInput.trim()]);
      setSubjectInput("");
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter((s) => s !== subject));
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

    if (!schoolValid) {
      setError("School ID tidak valid");
      return;
    }

    if (subjects.length === 0) {
      setError("Tambahkan minimal 1 mata pelajaran yang diajar");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/teacher-registration/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          schoolId,
          phone: phone || undefined,
          teacherProfile: {
            employeeId: employeeId || undefined,
            subjects,
            qualification: qualification || undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Registration error:", data);
        throw new Error(data.message || data.error || "Registrasi gagal");
      }

      // Success
      if (data.data.token) {
        localStorage.setItem("token", data.data.token);
      }

      // Redirect to teacher dashboard
      navigate("/teacher-dashboard");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar role="guest" activeRoute="/teacher-registration" />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">
        {/* Hero Section */}
        <motion.div 
          className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white"
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
                  <GraduationCap className="h-16 w-16" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Bergabung sebagai Guru
              </h1>
              
              <p className="text-lg md:text-xl text-teal-50 mb-12 max-w-2xl mx-auto">
                Kelola siswa, pantau progress, dan berikan intervensi yang tepat untuk meningkatkan hasil belajar
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
                  <h3 className="font-semibold mb-2">Kelola Siswa</h3>
                  <p className="text-sm text-teal-50">
                    Pantau progress dan prestasi setiap siswa secara real-time
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  variants={fadeInUp}
                >
                  <BarChart3 className="h-10 w-10 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Analisis Mendalam</h3>
                  <p className="text-sm text-teal-50">
                    Dashboard analitik untuk memahami kebutuhan siswa
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  variants={fadeInUp}
                >
                  <Target className="h-10 w-10 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Intervensi Tepat</h3>
                  <p className="text-sm text-teal-50">
                    Berikan bantuan personal sesuai kebutuhan tiap siswa
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
            <Card className="max-w-3xl mx-auto shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Form Pendaftaran Guru</CardTitle>
                <CardDescription>
                  Bergabung dengan sekolah Anda menggunakan School ID
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* School ID Validation Section */}
                  <div className="space-y-4 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border-2 border-teal-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-teal-600" />
                        Validasi School ID
                      </h3>
                      {schoolValid && (
                        <Badge variant="default" className="bg-teal-600">
                          Tervalidasi
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="schoolId">
                        School ID <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="schoolId"
                          type="text"
                          placeholder="SCH-00001"
                          value={schoolId}
                          onChange={(e) => handleSchoolIdChange(e.target.value)}
                          className={`pl-10 ${schoolValid ? 'border-green-500 focus:border-green-500' : ''}`}
                          required
                        />
                      </div>
                      
                      {validatingSchool && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                          Memvalidasi School ID...
                        </div>
                      )}
                      
                      {schoolValid && schoolName && (
                        <Alert className="bg-green-50 border-green-200">
                          <AlertDescription className="text-green-800 flex items-center gap-2">
                            <span className="text-green-600 text-lg">✓</span>
                            <div>
                              <p className="font-semibold">Sekolah ditemukan!</p>
                              <p className="text-sm">{schoolName}</p>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {schoolId && !schoolValid && !validatingSchool && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            School ID tidak valid. Silakan hubungi admin sekolah Anda untuk mendapatkan School ID yang benar.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5 text-teal-600" />
                      Informasi Personal
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Nama Lengkap <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="teacher@school.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">
                          Password <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Minimal 6 karakter"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                  {/* Teacher Profile */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Award className="h-5 w-5 text-teal-600" />
                      Informasi Profesional
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="employeeId">NIP / Employee ID</Label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="employeeId"
                            type="text"
                            placeholder="123456789"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="08123456789"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="qualification">Kualifikasi Pendidikan</Label>
                        <div className="relative">
                          <Award className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="qualification"
                            type="text"
                            placeholder="S1 Pendidikan Matematika"
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="subjects">
                          Mata Pelajaran yang Diajar <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="subjects"
                              type="text"
                              placeholder="Contoh: Matematika, Fisika"
                              value={subjectInput}
                              onChange={(e) => setSubjectInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addSubject();
                                }
                              }}
                              className="pl-10"
                            />
                          </div>
                          <Button type="button" onClick={addSubject} variant="outline">
                            Tambah
                          </Button>
                        </div>
                        {subjects.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {subjects.map((subject) => (
                              <Badge key={subject} variant="secondary" className="pl-3 pr-1">
                                {subject}
                                <button
                                  type="button"
                                  onClick={() => removeSubject(subject)}
                                  className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Tambahkan mata pelajaran satu per satu
                        </p>
                      </div>
                    </div>
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
                      className="flex-1 bg-teal-600 hover:bg-teal-700" 
                      disabled={loading || !schoolValid}
                    >
                      {loading ? "Memproses..." : "Daftar"}
                    </Button>
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    Sudah punya akun?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-teal-600 hover:underline font-medium"
                    >
                      Login di sini
                    </button>
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TeacherRegistration;
