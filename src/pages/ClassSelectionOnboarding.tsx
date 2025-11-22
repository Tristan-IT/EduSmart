import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  School,
  Users,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiClient } from "@/lib/apiClient";
import { AlertMessage } from "@/components/AlertMessage";

type GradeLevel = "SD" | "SMP" | "SMA" | "SMK";

interface ClassOption {
  value: number;
  label: string;
  description: string;
  icon?: string;
}

interface MajorOption {
  code: string;
  name: string;
  description: string;
  icon: string;
}

const gradeOptions = [
  {
    value: "SD" as GradeLevel,
    label: "SD",
    fullName: "Sekolah Dasar",
    description: "Kelas 1 - 6",
    icon: "🎒",
    color: "from-green-500 to-emerald-600",
  },
  {
    value: "SMP" as GradeLevel,
    label: "SMP",
    fullName: "Sekolah Menengah Pertama",
    description: "Kelas 7 - 9",
    icon: "📚",
    color: "from-blue-500 to-cyan-600",
  },
  {
    value: "SMA" as GradeLevel,
    label: "SMA",
    fullName: "Sekolah Menengah Atas",
    description: "Kelas 10 - 12",
    icon: "🎓",
    color: "from-purple-500 to-pink-600",
  },
  {
    value: "SMK" as GradeLevel,
    label: "SMK",
    fullName: "Sekolah Menengah Kejuruan",
    description: "Kelas 10 - 12",
    icon: "🛠️",
    color: "from-orange-500 to-red-600",
  },
];

const smkMajors: MajorOption[] = [
  {
    code: "PPLG",
    name: "Pengembangan Perangkat Lunak dan Gim",
    description: "Pemrograman, web development, mobile apps, game development",
    icon: "💻",
  },
  {
    code: "TJKT",
    name: "Teknik Jaringan Komputer dan Telekomunikasi",
    description: "Networking, sistem komputer, telekomunikasi",
    icon: "🌐",
  },
  {
    code: "DKV",
    name: "Desain Komunikasi Visual",
    description: "Desain grafis, multimedia, animasi",
    icon: "🎨",
  },
  {
    code: "BD",
    name: "Bisnis Digital",
    description: "E-commerce, digital marketing, manajemen bisnis online",
    icon: "💼",
  },
  {
    code: "HOTEL",
    name: "Perhotelan",
    description: "Hospitality, tourism, hotel management",
    icon: "🏨",
  },
  {
    code: "CULINARY",
    name: "Tata Boga",
    description: "Culinary arts, food service, catering",
    icon: "👨‍🍳",
  },
  {
    code: "OTHER",
    name: "Jurusan Lainnya",
    description: "Jurusan lain yang tersedia di sekolahmu",
    icon: "📋",
  },
];

export default function ClassSelectionOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel | null>(null);
  const [classNumber, setClassNumber] = useState<number | null>(null);
  const [semester, setSemester] = useState<1 | 2>(1);
  const [major, setMajor] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totalSteps = gradeLevel === "SMK" ? 4 : 3;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    // Check if user already completed onboarding
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await apiClient.get("/api/student/onboarding-status");
      // @ts-ignore - API response type
      if (response.onboardingComplete) {
        // Redirect to dashboard if already completed
        navigate("/learning-paths");
      }
    } catch (err) {
      console.error("Error checking onboarding status:", err);
    }
  };

  const getClassOptions = (): ClassOption[] => {
    if (!gradeLevel) return [];

    const ranges: Record<GradeLevel, { min: number; max: number }> = {
      SD: { min: 1, max: 6 },
      SMP: { min: 7, max: 9 },
      SMA: { min: 10, max: 12 },
      SMK: { min: 10, max: 12 },
    };

    const range = ranges[gradeLevel];
    const options: ClassOption[] = [];

    for (let i = range.min; i <= range.max; i++) {
      options.push({
        value: i,
        label: `Kelas ${i}`,
        description: `${gradeLevel} Kelas ${i}`,
        icon: "📖",
      });
    }

    return options;
  };

  const handleNext = () => {
    if (step === 1 && !gradeLevel) {
      setError("Pilih jenjang pendidikan terlebih dahulu");
      return;
    }
    if (step === 2 && !classNumber) {
      setError("Pilih kelas terlebih dahulu");
      return;
    }
    if (step === 3 && gradeLevel === "SMK" && !major) {
      setError("Pilih jurusan terlebih dahulu");
      return;
    }

    setError(null);
    
    if (step === totalSteps) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        currentGrade: gradeLevel,
        currentClass: classNumber,
        currentSemester: semester,
        major: gradeLevel === "SMK" ? major : undefined,
      };

      await apiClient.put("/api/student/profile", payload);

      setSuccess(true);
      
      // Redirect to learning paths after 2 seconds
      setTimeout(() => {
        navigate("/learning-paths");
      }, 2000);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Gagal menyimpan profil. Silakan coba lagi.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Profil Berhasil Disimpan!</h2>
          <p className="text-muted-foreground mb-4">Mengalihkan ke dashboard...</p>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
            <span className="text-sm">Memuat jalur pembelajaran...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Atur Profil Belajar
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Pilih jenjang, kelas, dan jurusan untuk mendapatkan materi yang sesuai
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2 text-sm font-medium">
            <span>Langkah {step} dari {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <AlertMessage type="danger" message={error} onClose={() => setError(null)} />
          </motion.div>
        )}

        {/* Steps */}
        <AnimatePresence mode="wait">
          {/* Step 1: Grade Level */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="w-6 h-6" />
                    Pilih Jenjang Pendidikan
                  </CardTitle>
                  <CardDescription>Kamu sekarang di jenjang apa?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gradeOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setGradeLevel(option.value);
                          setClassNumber(null); // Reset class when grade changes
                          setMajor(""); // Reset major
                        }}
                        className={`p-6 rounded-lg border-2 text-left transition-all ${
                          gradeLevel === option.value
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{option.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold">{option.label}</h3>
                              {gradeLevel === option.value && (
                                <Check className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              {option.fullName}
                            </p>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Class Number */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    Pilih Kelas
                  </CardTitle>
                  <CardDescription>
                    Kamu sekarang kelas berapa di {gradeLevel}?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {getClassOptions().map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setClassNumber(option.value)}
                        className={`p-6 rounded-lg border-2 text-center transition-all ${
                          classNumber === option.value
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                      >
                        <div className="text-3xl mb-2">{option.icon}</div>
                        <div className="font-bold text-lg">{option.label}</div>
                        {classNumber === option.value && (
                          <Check className="w-5 h-5 text-primary mx-auto mt-2" />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Semester Selection */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5" />
                      <h4 className="font-semibold">Semester</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSemester(1)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          semester === 1
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                      >
                        <div className="font-bold">Semester 1</div>
                        <div className="text-sm text-muted-foreground">Ganjil</div>
                      </button>
                      <button
                        onClick={() => setSemester(2)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          semester === 2
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                      >
                        <div className="font-bold">Semester 2</div>
                        <div className="text-sm text-muted-foreground">Genap</div>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Major (SMK only) */}
          {step === 3 && gradeLevel === "SMK" && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-6 h-6" />
                    Pilih Jurusan
                  </CardTitle>
                  <CardDescription>Jurusan apa yang kamu ambil di SMK?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {smkMajors.map((option) => (
                      <motion.button
                        key={option.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMajor(option.code)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          major === option.code
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{option.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {option.code}
                              </Badge>
                              {major === option.code && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <h3 className="font-bold mb-1">{option.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3/4: Confirmation */}
          {((step === 3 && gradeLevel !== "SMK") || (step === 4 && gradeLevel === "SMK")) && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="w-6 h-6" />
                    Konfirmasi Profil
                  </CardTitle>
                  <CardDescription>Pastikan data sudah benar sebelum menyimpan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-primary/10 to-purple-100 p-6 rounded-lg">
                    <div className="grid gap-4">
                      <div className="flex items-center gap-3">
                        <School className="w-5 h-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Jenjang</div>
                          <div className="font-bold text-lg">
                            {gradeOptions.find((g) => g.value === gradeLevel)?.fullName}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Kelas</div>
                          <div className="font-bold text-lg">Kelas {classNumber}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Semester</div>
                          <div className="font-bold text-lg">
                            Semester {semester} ({semester === 1 ? "Ganjil" : "Genap"})
                          </div>
                        </div>
                      </div>

                      {gradeLevel === "SMK" && major && (
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-sm text-muted-foreground">Jurusan</div>
                            <div className="font-bold text-lg">
                              {smkMajors.find((m) => m.code === major)?.name}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-1">
                        Profil ini akan digunakan untuk:
                      </p>
                      <ul className="text-blue-700 space-y-1">
                        <li>• Menyesuaikan materi pembelajaran</li>
                        <li>• Memberikan rekomendasi jalur belajar</li>
                        <li>• Menampilkan konten sesuai tingkat</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mt-8"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            disabled={step === 1 || loading}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </Button>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={loading}
            className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Menyimpan...
              </>
            ) : step === totalSteps ? (
              <>
                <Check className="w-4 h-4" />
                Simpan & Lanjutkan
              </>
            ) : (
              <>
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
