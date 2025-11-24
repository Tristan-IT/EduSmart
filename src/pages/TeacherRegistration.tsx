import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Mail, Lock, User, Building2, Hash, BookOpen, Award, X, Users, BarChart3, Target, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const TeacherRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
  
  // Classes from school
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  const validateSchoolId = async (id: string) => {
    if (!id || id.length < 8) {
      setSchoolValid(false);
      setSchoolName("");
      setAvailableClasses([]);
      return;
    }

    setValidatingSchool(true);
    setLoadingClasses(true);
    try {
      // Validate school exists and get classes
      const classesResponse = await fetch(`http://localhost:5000/api/classes/public/school/${id}`);
      const classesData = await classesResponse.json();

      if (classesResponse.ok && classesData.success) {
        setSchoolValid(true);
        setSchoolName(classesData.data[0]?.schoolName || "Sekolah Valid");
        setAvailableClasses(classesData.data || []);
        
        // Also load subjects for this school
        const subjectsResponse = await fetch(`http://localhost:5000/api/subjects/public/school/${id}`);
        const subjectsData = await subjectsResponse.json();
        
        if (subjectsResponse.ok && subjectsData.success) {
          setAvailableSubjects(subjectsData.data || []);
        }
      } else {
        setSchoolValid(false);
        setSchoolName("");
        setAvailableClasses([]);
        setAvailableSubjects([]);
      }
    } catch (err) {
      setSchoolValid(false);
      setSchoolName("");
      setAvailableClasses([]);
      setAvailableSubjects([]);
    } finally {
      setValidatingSchool(false);
      setLoadingClasses(false);
    }
  };

  const handleSchoolIdChange = (value: string) => {
    setSchoolId(value);
    validateSchoolId(value);
  };

  const addSubject = (subjectName: string) => {
    if (subjectName && !subjects.includes(subjectName)) {
      setSubjects([...subjects, subjectName]);
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

    if (selectedClassIds.length === 0) {
      setError("Pilih minimal 1 kelas yang akan diajar");
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
          employeeId: employeeId || undefined,
          subjects,
          classIds: selectedClassIds,
          qualification: qualification || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Registration error:", data);
        throw new Error(data.message || data.error || "Registrasi gagal");
      }

      // Success - login to AuthContext
      if (data.token && data.user) {
        // Store in AuthContext (will also save to localStorage)
        login({
          token: data.token,
          user: {
            id: data.user.id || data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            school: data.user.school,
          },
        });

        // Redirect to teacher dashboard
        navigate("/teacher-dashboard");
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

                  {/* Instruction Card */}
                  <Alert className="bg-gradient-to-r from-blue-50 via-teal-50 to-cyan-50 border-2 border-teal-300">
                    <Building2 className="h-5 w-5 text-teal-600" />
                    <AlertDescription className="ml-2">
                      <p className="font-semibold text-teal-900 mb-2 text-base">📋 Langkah Registrasi:</p>
                      <ol className="text-sm text-teal-800 space-y-1 ml-4 list-decimal">
                        <li><strong>Masukkan School ID</strong> yang diberikan oleh sekolah Anda</li>
                        <li><strong>Pilih Mata Pelajaran</strong> yang akan Anda ajar</li>
                        <li><strong>Pilih Kelas</strong> yang akan Anda tangani</li>
                        <li><strong>Lengkapi Data Pribadi</strong> dan submit registrasi</li>
                      </ol>
                      <p className="text-xs text-teal-600 mt-2 italic">
                        💡 Belum punya School ID? Hubungi admin sekolah Anda.
                      </p>
                    </AlertDescription>
                  </Alert>

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

                  {/* Class Selection */}
                  {schoolValid && availableClasses.length > 0 && (
                    <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Pilih Kelas yang Diajar <span className="text-destructive">*</span>
                      </h3>
                      <p className="text-sm text-gray-600">
                        Pilih kelas-kelas yang akan Anda ajar di sekolah ini
                      </p>

                      {loadingClasses ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          Memuat daftar kelas...
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
                          {availableClasses.map((cls) => {
                            const isSelected = selectedClassIds.includes(cls.classId);
                            const percentage = cls.maxStudents > 0 
                              ? Math.round(((cls.currentStudents || 0) / cls.maxStudents) * 100) 
                              : 0;
                            const isFull = percentage >= 100;
                            
                            return (
                              <label
                                key={cls.classId}
                                className={`relative flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-100 shadow-sm'
                                    : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-sm'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedClassIds([...selectedClassIds, cls.classId]);
                                    } else {
                                      setSelectedClassIds(selectedClassIds.filter(id => id !== cls.classId));
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <p className="font-medium text-sm text-gray-900 truncate">
                                      {cls.displayName || cls.className}
                                    </p>
                                    {isFull && (
                                      <span className="flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                        Penuh
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="font-mono">{cls.classId}</span>
                                    <span>•</span>
                                    <span className={`font-medium ${
                                      isFull ? 'text-red-600' : percentage >= 80 ? 'text-orange-600' : 'text-green-600'
                                    }`}>
                                      {cls.currentStudents || 0}/{cls.maxStudents}
                                    </span>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {selectedClassIds.length > 0 && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">
                            <span className="inline-flex items-center justify-center w-5 h-5 mr-2 text-xs font-bold text-white bg-blue-600 rounded-full">
                              {selectedClassIds.length}
                            </span>
                            Kelas dipilih
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedClassIds([])}
                            className="text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100 h-7"
                          >
                            Bersihkan
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {schoolValid && availableClasses.length === 0 && !loadingClasses && (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertDescription className="text-yellow-800">
                        Belum ada kelas yang tersedia di sekolah ini. Hubungi admin sekolah untuk membuat kelas terlebih dahulu.
                      </AlertDescription>
                    </Alert>
                  )}

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

                      {/* Subject Selection - Same style as Class Selection */}
                      {schoolValid && availableSubjects.length > 0 && (
                        <div className="md:col-span-2 space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-purple-600" />
                            Pilih Mata Pelajaran yang Diajar <span className="text-destructive">*</span>
                          </h3>
                          <p className="text-sm text-gray-600">
                            Pilih mata pelajaran yang akan Anda ajar di sekolah ini
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
                            {availableSubjects.map((subject) => {
                              const isSelected = subjects.includes(subject.name);
                              
                              return (
                                <Card
                                  key={subject._id}
                                  className={`p-4 cursor-pointer transition-all border-2 ${
                                    isSelected
                                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md'
                                      : 'border-gray-200 hover:border-purple-300 hover:shadow-sm'
                                  }`}
                                  onClick={() => {
                                    if (isSelected) {
                                      removeSubject(subject.name);
                                    } else {
                                      addSubject(subject.name);
                                    }
                                  }}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <h4 className="font-semibold text-sm">
                                          {subject.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                          {subject.code}
                                        </p>
                                      </div>
                                      {isSelected && (
                                        <CheckCircle2 className="h-5 w-5 text-purple-600" />
                                      )}
                                    </div>
                                    {subject.category && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {subject.category}
                                      </Badge>
                                    )}
                                  </div>
                                </Card>
                              );
                            })}
                          </div>

                          {subjects.length > 0 && (
                            <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                              <p className="text-sm font-medium text-purple-900">
                                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 text-xs font-bold text-white bg-purple-600 rounded-full">
                                  {subjects.length}
                                </span>
                                Mata pelajaran dipilih
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setSubjects([])}
                                className="text-purple-700 hover:text-purple-900 hover:bg-purple-100"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Bersihkan semua
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {schoolValid && availableSubjects.length === 0 && (
                        <div className="md:col-span-2 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm font-medium text-gray-700 mb-1">Belum Ada Mata Pelajaran</p>
                          <p className="text-xs text-gray-500">
                            Hubungi admin sekolah untuk menambahkan mata pelajaran terlebih dahulu
                          </p>
                        </div>
                      )}

                      {!schoolValid && schoolId && (
                        <div className="md:col-span-2 p-8 border-2 border-dashed border-orange-300 rounded-lg text-center bg-orange-50">
                          <BookOpen className="h-12 w-12 text-orange-400 mx-auto mb-3" />
                          <p className="text-sm font-medium text-orange-700 mb-1">Masukkan School ID yang Valid</p>
                          <p className="text-xs text-orange-600">
                            Mata pelajaran dan kelas akan muncul setelah School ID tervalidasi
                          </p>
                        </div>
                      )}
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
