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
  AlertCircle,
  Sparkles,
  Lock,
  Save,
  X,
} from "lucide-react";

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

interface ClassData {
  _id: string;
  classId: string;
  displayName: string;
  shortName: string;
  grade: number;
  section: string;
  schoolType: "SD" | "SMP" | "SMA" | "SMK";
  specialization?: string;
  majorCode?: string;
  majorName?: string;
  maxStudents: number;
  academicYear: string;
  homeRoomTeacherId?: string;
}

interface Props {
  classData: ClassData;
  onSave: (data: Partial<ClassData>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const EditClassModal = ({ classData, onSave, onCancel, loading = false }: Props) => {
  const [error, setError] = useState("");
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [formData, setFormData] = useState({
    section: classData.section,
    specialization: classData.specialization || "",
    majorCode: classData.majorCode || "",
    majorName: classData.majorName || "",
    maxStudents: classData.maxStudents,
    academicYear: classData.academicYear,
  });

  const [previewName, setPreviewName] = useState(classData.displayName);

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
    const { grade } = classData;
    const { section, specialization, majorCode } = formData;

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

  const needsSpecialization = () => {
    if (!schoolConfig) return false;
    return (
      (schoolConfig.schoolType === "SMA" && classData.grade >= 11) ||
      schoolConfig.schoolType === "SMK"
    );
  };

  const handleSubmit = async () => {
    setError("");

    if (!formData.section || formData.section.trim() === "") {
      setError("Section harus diisi");
      return;
    }

    if (formData.maxStudents < 1) {
      setError("Kapasitas minimal 1 siswa");
      return;
    }

    // Validate specialization/major for applicable school types
    if (needsSpecialization()) {
      if (schoolConfig?.schoolType === "SMA" && !formData.specialization) {
        setError("Peminatan harus dipilih");
        return;
      }
      if (schoolConfig?.schoolType === "SMK" && !formData.majorCode) {
        setError("Jurusan harus dipilih");
        return;
      }
    }

    try {
      await onSave(formData);
    } catch (err: any) {
      setError(err.message || "Gagal mengupdate kelas");
    }
  };

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
          Konfigurasi sekolah tidak ditemukan.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Read-only Info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground flex items-center gap-2">
                <Lock className="h-3 w-3" />
                Jenis Sekolah
              </Label>
              <div className="mt-1">
                <Badge variant="secondary">{schoolConfig.schoolType}</Badge>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground flex items-center gap-2">
                <Lock className="h-3 w-3" />
                Tingkat
              </Label>
              <div className="mt-1">
                <Badge variant="secondary">Kelas {classData.grade}</Badge>
              </div>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Lock className="h-3 w-3" />
                Class ID
              </Label>
              <div className="mt-1 font-mono text-sm">{classData.classId}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Edit Informasi Kelas</h3>

        {/* Section Input */}
        <div className="space-y-2">
          <Label htmlFor="section">Unit/Rombel *</Label>
          <Input
            id="section"
            value={formData.section}
            onChange={(e) =>
              setFormData({ ...formData, section: e.target.value.trim() })
            }
            placeholder="Contoh: 1, 2, A, B"
            className="text-lg"
          />
          <p className="text-xs text-muted-foreground">
            {schoolConfig.schoolType === "SD"
              ? "Contoh: A, B, 1, 2, Merah, Biru"
              : "Contoh: 1, 2, 3, A, B, C"}
          </p>
        </div>

        {/* Specialization (SMA Grade 11-12) */}
        {schoolConfig.schoolType === "SMA" && classData.grade >= 11 && (
          <div className="space-y-2">
            <Label>Peminatan *</Label>
            <RadioGroup
              value={formData.specialization}
              onValueChange={(value) => setFormData({ ...formData, specialization: value })}
            >
              <div className="grid gap-3">
                {schoolConfig.smaSpecializations?.map((spec) => (
                  <div
                    key={spec}
                    className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.specialization === spec
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setFormData({ ...formData, specialization: spec })}
                  >
                    <RadioGroupItem value={spec} id={`spec-${spec}`} />
                    <Label htmlFor={`spec-${spec}`} className="cursor-pointer font-medium flex-1">
                      {spec}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Major (SMK All Grades) */}
        {schoolConfig.schoolType === "SMK" && (
          <div className="space-y-2">
            <Label>Jurusan *</Label>
            <RadioGroup
              value={formData.majorCode}
              onValueChange={(value) => {
                const major = schoolConfig.smkMajors?.find((m) => m.code === value);
                setFormData({
                  ...formData,
                  majorCode: value,
                  majorName: major?.name || "",
                });
              }}
            >
              <div className="grid gap-3">
                {schoolConfig.smkMajors?.map((major) => (
                  <div
                    key={major.code}
                    className={`flex items-start space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
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
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Capacity and Academic Year */}
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
      </div>

      {/* Preview */}
      <Card className="bg-gradient-to-br from-primary/10 to-purple/10 border-primary/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Preview Nama Kelas</span>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-muted-foreground">Display Name:</span>
              <p className="text-2xl font-bold text-primary">{previewName}</p>
            </div>
            {previewName !== classData.displayName && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Nama kelas akan berubah dari "{classData.displayName}" menjadi "{previewName}"
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          <X className="mr-2 h-4 w-4" />
          Batal
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditClassModal;
