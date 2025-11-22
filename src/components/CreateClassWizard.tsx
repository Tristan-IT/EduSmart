import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SMKMajor {
  code: string;
  name: string;
  description?: string;
}

interface SchoolConfig {
  schoolType: "SD" | "SMP" | "SMA" | "SMK";
  smaSpecializations?: string[];
  smkMajors?: SMKMajor[];
}

interface ClassFormData {
  grade: number;
  specialization?: string;
  majorCode?: string;
  majorName?: string;
  section: string;
  maxStudents: number;
  academicYear: string;
  homeRoomTeacherId?: string;
}

interface Props {
  onSubmit: (data: ClassFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CreateClassWizard = ({ onSubmit, onCancel, loading = false }: Props) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [formData, setFormData] = useState<ClassFormData>({
    grade: 10,
    section: "",
    maxStudents: 36,
    academicYear: "2024/2025",
  });

  const [previewName, setPreviewName] = useState("");

  useEffect(() => {
    fetchSchoolConfig();
  }, []);

  useEffect(() => {
    generatePreviewName();
  }, [formData, schoolConfig]);

  const fetchSchoolConfig = async () => {
    try {
      setLoadingConfig(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/school-owner/setup", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setSchoolConfig({
          schoolType: data.data.schoolType,
          smaSpecializations: data.data.smaSpecializations || [],
          smkMajors: data.data.smkMajors || [],
        });
        
        // Set default grade based on school type
        if (data.data.schoolType === "SD") {
          setFormData(prev => ({ ...prev, grade: 1 }));
        } else if (data.data.schoolType === "SMP") {
          setFormData(prev => ({ ...prev, grade: 7 }));
        }
      }
    } catch (err) {
      setError("Gagal memuat konfigurasi sekolah");
    } finally {
      setLoadingConfig(false);
    }
  };

  const generatePreviewName = () => {
    if (!schoolConfig) return;

    const { schoolType } = schoolConfig;
    const { grade, section, specialization, majorCode } = formData;

    let name = "";

    if (schoolType === "SD" || schoolType === "SMP") {
      name = `Kelas ${grade} ${section}`;
    } else if (schoolType === "SMA") {
      if (grade === 10 || !specialization) {
        name = `Kelas ${grade} ${section}`;
      } else {
        name = `Kelas ${grade} ${specialization} ${section}`;
      }
    } else if (schoolType === "SMK") {
      name = `Kelas ${grade} ${majorCode || "..."} ${section}`;
    }

    setPreviewName(name);
  };

  const getAvailableGrades = () => {
    if (!schoolConfig) return [];

    switch (schoolConfig.schoolType) {
      case "SD":
        return [1, 2, 3, 4, 5, 6];
      case "SMP":
        return [7, 8, 9];
      case "SMA":
      case "SMK":
        return [10, 11, 12];
      default:
        return [];
    }
  };

  const needsSpecialization = () => {
    if (!schoolConfig) return false;
    return (
      (schoolConfig.schoolType === "SMA" && formData.grade >= 11) ||
      schoolConfig.schoolType === "SMK"
    );
  };

  const handleNext = () => {
    setError("");

    if (step === 1) {
      if (!formData.grade) {
        setError("Pilih tingkat kelas terlebih dahulu");
        return;
      }
    }

    if (step === 2 && needsSpecialization()) {
      if (schoolConfig?.schoolType === "SMA" && !formData.specialization) {
        setError("Pilih peminatan terlebih dahulu");
        return;
      }
      if (schoolConfig?.schoolType === "SMK" && !formData.majorCode) {
        setError("Pilih jurusan terlebih dahulu");
        return;
      }
    }

    if (step === 3) {
      if (!formData.section || formData.section.trim() === "") {
        setError("Unit/Rombel harus diisi");
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setError("");

    if (!formData.section) {
      setError("Section harus diisi");
      return;
    }

    if (formData.maxStudents < 1) {
      setError("Kapasitas minimal 1 siswa");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || "Gagal membuat kelas");
    }
  };

  const totalSteps = needsSpecialization() ? 4 : 3;

  if (loadingConfig) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Memuat konfigurasi...</p>
      </div>
    );
  }

  if (!schoolConfig) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Konfigurasi sekolah belum diatur. Silakan setup terlebih dahulu.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isCompleted = step > stepNum;
          const isCurrent = step === stepNum;

          return (
            <div key={stepNum} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? "bg-primary border-primary text-white"
                      : isCurrent
                      ? "border-primary text-primary"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNum}
                </div>
                <span className="text-xs mt-2 text-center">
                  {stepNum === 1 && "Tingkat"}
                  {stepNum === 2 && needsSpecialization() && "Peminatan/Jurusan"}
                  {stepNum === 2 && !needsSpecialization() && "Unit"}
                  {stepNum === 3 && needsSpecialization() && "Unit"}
                  {stepNum === 3 && !needsSpecialization() && "Detail"}
                  {stepNum === 4 && "Detail"}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Step 1: Select Grade */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Pilih Tingkat Kelas</h3>
                <p className="text-sm text-muted-foreground">
                  Tentukan tingkat kelas yang akan dibuat
                </p>
              </div>

              <RadioGroup
                value={formData.grade.toString()}
                onValueChange={(value) => setFormData({ ...formData, grade: parseInt(value) })}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getAvailableGrades().map((grade) => (
                    <div
                      key={grade}
                      className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.grade === grade
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setFormData({ ...formData, grade })}
                    >
                      <RadioGroupItem value={grade.toString()} id={`grade-${grade}`} />
                      <Label htmlFor={`grade-${grade}`} className="cursor-pointer font-medium">
                        Kelas {grade}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Select Specialization/Major (conditional) */}
          {step === 2 && needsSpecialization() && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  {schoolConfig.schoolType === "SMA" ? "Pilih Peminatan" : "Pilih Jurusan"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {schoolConfig.schoolType === "SMA"
                    ? "Tentukan peminatan untuk kelas ini"
                    : "Tentukan jurusan untuk kelas ini"}
                </p>
              </div>

              {schoolConfig.schoolType === "SMA" && (
                <RadioGroup
                  value={formData.specialization || ""}
                  onValueChange={(value) => setFormData({ ...formData, specialization: value })}
                >
                  <div className="grid gap-3">
                    {schoolConfig.smaSpecializations?.map((spec) => (
                      <div
                        key={spec}
                        className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.specialization === spec
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setFormData({ ...formData, specialization: spec })}
                      >
                        <RadioGroupItem value={spec} id={`spec-${spec}`} />
                        <div className="flex-1">
                          <Label htmlFor={`spec-${spec}`} className="cursor-pointer font-medium">
                            {spec}
                          </Label>
                        </div>
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}

              {schoolConfig.schoolType === "SMK" && (
                <RadioGroup
                  value={formData.majorCode || ""}
                  onValueChange={(value) => {
                    const major = schoolConfig.smkMajors?.find((m) => m.code === value);
                    setFormData({
                      ...formData,
                      majorCode: value,
                      majorName: major?.name,
                    });
                  }}
                >
                  <div className="grid gap-3">
                    {schoolConfig.smkMajors?.map((major) => (
                      <div
                        key={major.code}
                        className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.majorCode === major.code
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            majorCode: major.code,
                            majorName: major.name,
                          })
                        }
                      >
                        <RadioGroupItem value={major.code} id={`major-${major.code}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono">
                              {major.code}
                            </Badge>
                            <Label
                              htmlFor={`major-${major.code}`}
                              className="cursor-pointer font-medium"
                            >
                              {major.name}
                            </Label>
                          </div>
                          {major.description && (
                            <p className="text-sm text-muted-foreground">{major.description}</p>
                          )}
                        </div>
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </div>
          )}

          {/* Step 3: Section (or Step 2 if no specialization needed) */}
          {((step === 2 && !needsSpecialization()) || (step === 3 && needsSpecialization())) && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Unit/Rombel</h3>
                <p className="text-sm text-muted-foreground">
                  {schoolConfig.schoolType === "SD"
                    ? "Contoh: A, B, 1, 2, Merah, Biru"
                    : "Contoh: 1, 2, 3, A, B, C"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Unit/Rombel *</Label>
                <Input
                  id="section"
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value.trim() })
                  }
                  placeholder="Masukkan unit/rombel"
                  className="text-lg"
                  autoFocus
                />
              </div>

              {/* Preview */}
              {previewName && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Preview Nama Kelas</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">{previewName}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 4: Additional Details (or Step 3 if no specialization) */}
          {((step === 3 && !needsSpecialization()) || (step === 4 && needsSpecialization())) && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Detail Kelas</h3>
                <p className="text-sm text-muted-foreground">
                  Atur kapasitas dan tahun ajaran
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Kapasitas Maksimal *</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    min="1"
                    value={formData.maxStudents}
                    onChange={(e) =>
                      setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicYear">Tahun Ajaran *</Label>
                  <Input
                    id="academicYear"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  />
                </div>
              </div>

              {/* Final Preview */}
              <Card className="bg-gradient-to-br from-primary/10 to-purple/10 border-primary/30">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    Ringkasan Kelas Baru
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nama Kelas:</span>
                      <span className="font-semibold">{previewName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tingkat:</span>
                      <span className="font-semibold">Kelas {formData.grade}</span>
                    </div>
                    {formData.specialization && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Peminatan:</span>
                        <Badge variant="secondary">{formData.specialization}</Badge>
                      </div>
                    )}
                    {formData.majorCode && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Jurusan:</span>
                        <Badge variant="secondary">{formData.majorCode}</Badge>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kapasitas:</span>
                      <span className="font-semibold">{formData.maxStudents} siswa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tahun Ajaran:</span>
                      <span className="font-semibold">{formData.academicYear}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={step === 1 ? onCancel : handleBack} disabled={loading}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {step === 1 ? "Batal" : "Kembali"}
        </Button>

        {step < totalSteps ? (
          <Button onClick={handleNext}>
            Lanjut
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Membuat...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Buat Kelas
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateClassWizard;
