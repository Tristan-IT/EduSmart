import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  GraduationCap,
  School,
  Building2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  Check,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface SMKMajor {
  code: string;
  name: string;
  description?: string;
}

interface SubjectPreview {
  code: string;
  name: string;
  category: "WAJIB" | "PEMINATAN" | "MUATAN_LOKAL" | "EKSTRAKURIKULER";
  schoolTypes: Array<"SD" | "SMP" | "SMA" | "SMK">;
  grades: number[];
  description?: string;
  color?: string;
  icon?: string;
}

const SchoolSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [subjectPreview, setSubjectPreview] = useState<{
    all: SubjectPreview[];
    grouped: Record<string, SubjectPreview[]>;
    total: number;
  } | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Form state
  const [schoolTypes, setSchoolTypes] = useState<Array<"SD" | "SMP" | "SMA" | "SMK">>([
    "SMA",
  ]);
  const [schoolTypesOpen, setSchoolTypesOpen] = useState(false);
  const [smaSpecializations, setSmaSpecializations] = useState<string[]>(["IPA", "IPS"]);
  const [smkMajors, setSmkMajors] = useState<SMKMajor[]>([
    { code: "PPLG", name: "Pengembangan Perangkat Lunak dan Gim", description: "" },
  ]);

  const availableSchoolTypes: Array<{
    value: "SD" | "SMP" | "SMA" | "SMK";
    label: string;
    description: string;
  }> = [
    { value: "SD", label: "Sekolah Dasar (SD)", description: "Kelas 1-6, sistem kelas sederhana" },
    {
      value: "SMP",
      label: "Sekolah Menengah Pertama (SMP)",
      description: "Kelas 7-9, sistem kelas sederhana",
    },
    {
      value: "SMA",
      label: "Sekolah Menengah Atas (SMA)",
      description: "Kelas 10-12 dengan peminatan (IPA, IPS, Bahasa)",
    },
    {
      value: "SMK",
      label: "Sekolah Menengah Kejuruan (SMK)",
      description: "Kelas 10-12 dengan jurusan kejuruan",
    },
  ];

  const toggleSchoolType = (type: "SD" | "SMP" | "SMA" | "SMK") => {
    if (schoolTypes.includes(type)) {
      setSchoolTypes(schoolTypes.filter((t) => t !== type));
    } else {
      setSchoolTypes([...schoolTypes, type]);
    }
  };

  // Fetch subject preview when school types change
  useEffect(() => {
    if (schoolTypes.length > 0) {
      fetchSubjectPreview();
    } else {
      setSubjectPreview(null);
    }
  }, [schoolTypes]);

  const fetchSubjectPreview = async () => {
    try {
      setLoadingPreview(true);
      const response = await fetch("http://localhost:5000/api/subjects/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ schoolTypes }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSubjectPreview(data.data);
      }
    } catch (err) {
      console.error("Error fetching subject preview:", err);
    } finally {
      setLoadingPreview(false);
    }
  };

  // New major form state
  const [newMajor, setNewMajor] = useState<SMKMajor>({
    code: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    checkExistingSetup();
  }, []);

  const checkExistingSetup = async () => {
    try {
      setCheckingSetup(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/school-owner/setup", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data.isConfigured) {
        // Already configured, redirect to dashboard
        navigate("/school-owner");
      } else if (data.success && (data.data.schoolTypes || data.data.schoolType)) {
        // Partially configured, load existing data
        if (data.data.schoolTypes && data.data.schoolTypes.length > 0) {
          setSchoolTypes(data.data.schoolTypes);
        } else if (data.data.schoolType) {
          // Backward compatibility - convert single type to array
          setSchoolTypes([data.data.schoolType]);
        }
        if (data.data.smaSpecializations && data.data.smaSpecializations.length > 0) {
          setSmaSpecializations(data.data.smaSpecializations);
        }
        if (data.data.smkMajors && data.data.smkMajors.length > 0) {
          setSmkMajors(data.data.smkMajors);
        }
      }
    } catch (err: any) {
      console.error("Error checking setup:", err);
      // Continue to setup page if check fails
    } finally {
      setCheckingSetup(false);
    }
  };

  const handleSmaSpecializationToggle = (spec: string) => {
    if (smaSpecializations.includes(spec)) {
      setSmaSpecializations(smaSpecializations.filter((s) => s !== spec));
    } else {
      setSmaSpecializations([...smaSpecializations, spec]);
    }
  };

  const handleAddMajor = () => {
    if (!newMajor.code || !newMajor.name) {
      setError("Kode dan Nama jurusan wajib diisi");
      return;
    }

    // Check duplicate code
    if (smkMajors.some((m) => m.code.toUpperCase() === newMajor.code.toUpperCase())) {
      setError("Kode jurusan sudah ada");
      return;
    }

    setSmkMajors([
      ...smkMajors,
      {
        code: newMajor.code.toUpperCase(),
        name: newMajor.name,
        description: newMajor.description,
      },
    ]);

    setNewMajor({ code: "", name: "", description: "" });
    setError("");
  };

  const handleRemoveMajor = (code: string) => {
    setSmkMajors(smkMajors.filter((m) => m.code !== code));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Validation
      if (schoolTypes.length === 0) {
        setError("Minimal pilih 1 jenjang pendidikan");
        setLoading(false);
        return;
      }

      if (schoolTypes.includes("SMA") && smaSpecializations.length === 0) {
        setError("Minimal pilih 1 peminatan untuk SMA");
        setLoading(false);
        return;
      }

      if (schoolTypes.includes("SMK") && smkMajors.length === 0) {
        setError("Minimal tambahkan 1 jurusan untuk SMK");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/school-owner/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          schoolTypes,
          smaSpecializations: schoolTypes.includes("SMA") ? smaSpecializations : undefined,
          smkMajors: schoolTypes.includes("SMK") ? smkMajors : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal menyimpan konfigurasi");
      }

      setSuccess("Konfigurasi sekolah berhasil disimpan!");
      
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate("/school-owner");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan konfigurasi");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Memeriksa konfigurasi...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
              <School className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Konfigurasi Sekolah</h1>
          <p className="text-lg text-muted-foreground">
            Atur jenis sekolah dan konfigurasi kelas untuk sistem Anda
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div variants={fadeInUp}>
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Setup Awal</CardTitle>
              <CardDescription>
                Pilih jenis sekolah dan konfigurasi yang sesuai. Setup ini hanya dilakukan sekali.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Error/Success Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* School Type Selection */}
              <div className="space-y-4">
                <div>
                  <Label className="text-lg font-semibold">Jenis Sekolah</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pilih jenjang pendidikan yang tersedia di sekolah Anda (bisa lebih dari satu)
                  </p>
                </div>

                <Popover open={schoolTypesOpen} onOpenChange={setSchoolTypesOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={schoolTypesOpen}
                      className="w-full justify-between h-auto min-h-[48px] hover:bg-gray-50"
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
                            onSelect={() => toggleSchoolType(type.value)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div
                              className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                                schoolTypes.includes(type.value)
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible"
                              }`}
                            >
                              <Check className="h-3 w-3" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {type.description}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                {schoolTypes.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {schoolTypes.length} jenjang dipilih
                  </p>
                )}
              </div>

              {/* SMA Specializations */}
              {schoolTypes.includes("SMA") && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <Label className="text-lg font-semibold">Peminatan SMA</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pilih peminatan yang tersedia di sekolah Anda
                    </p>
                  </div>

                  <div className="space-y-3">
                    {["IPA", "IPS", "BAHASA"].map((spec) => (
                      <div
                        key={spec}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <Checkbox
                          id={spec}
                          checked={smaSpecializations.includes(spec)}
                          onCheckedChange={() => handleSmaSpecializationToggle(spec)}
                        />
                        <Label htmlFor={spec} className="flex-1 cursor-pointer font-medium">
                          {spec}
                        </Label>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SMK Majors */}
              {schoolTypes.includes("SMK") && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <Label className="text-lg font-semibold">Jurusan SMK</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tambahkan jurusan yang tersedia di sekolah Anda
                    </p>
                  </div>

                  {/* Existing Majors */}
                  {smkMajors.length > 0 && (
                    <div className="space-y-2">
                      {smkMajors.map((major) => (
                        <div
                          key={major.code}
                          className="flex items-start gap-3 p-4 border rounded-lg bg-gray-50"
                        >
                          <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono">
                                {major.code}
                              </Badge>
                              <h4 className="font-semibold">{major.name}</h4>
                            </div>
                            {major.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {major.description}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMajor(major.code)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Major */}
                  <div className="border-2 border-dashed rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-sm">Tambah Jurusan Baru</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="majorCode">Kode Jurusan *</Label>
                        <Input
                          id="majorCode"
                          placeholder="PPLG, TKJ, RPL, dll"
                          value={newMajor.code}
                          onChange={(e) =>
                            setNewMajor({ ...newMajor, code: e.target.value.toUpperCase() })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="majorName">Nama Jurusan *</Label>
                        <Input
                          id="majorName"
                          placeholder="Pengembangan Perangkat Lunak dan Gim"
                          value={newMajor.name}
                          onChange={(e) => setNewMajor({ ...newMajor, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="majorDesc">Deskripsi (Opsional)</Label>
                        <Input
                          id="majorDesc"
                          placeholder="Deskripsi singkat tentang jurusan ini"
                          value={newMajor.description}
                          onChange={(e) =>
                            setNewMajor({ ...newMajor, description: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddMajor} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Jurusan
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Subject Preview */}
              {schoolTypes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 border-t pt-6"
                >
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <School className="h-5 w-5 text-primary" />
                      Mata Pelajaran yang Akan Dibuat
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sistem akan otomatis membuat {subjectPreview?.total || 0} mata pelajaran berdasarkan jenjang yang dipilih
                    </p>
                  </div>

                  {loadingPreview ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : subjectPreview ? (
                    <div className="space-y-4">
                      {/* Category breakdown */}
                      {Object.entries(subjectPreview.grouped).map(([category, subjects]) => {
                        if (subjects.length === 0) return null;
                        
                        const categoryLabels: Record<string, string> = {
                          WAJIB: "Mata Pelajaran Wajib",
                          PEMINATAN: "Mata Pelajaran Peminatan",
                          MUATAN_LOKAL: "Muatan Lokal",
                          EKSTRAKURIKULER: "Ekstrakurikuler",
                        };

                        return (
                          <div key={category} className="space-y-2">
                            <h4 className="font-medium text-sm text-primary">
                              {categoryLabels[category]} ({subjects.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {subjects.map((subject) => (
                                <div
                                  key={subject.code}
                                  className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50"
                                  style={{
                                    borderLeft: `4px solid ${subject.color || "#3b82f6"}`,
                                  }}
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm">{subject.name}</span>
                                      <Badge variant="outline" className="text-xs font-mono">
                                        {subject.code}
                                      </Badge>
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                      {subject.schoolTypes.map((type) => (
                                        <Badge key={type} variant="secondary" className="text-xs">
                                          {type}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </motion.div>
              )}

              {/* Preview */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-3">Preview Konfigurasi</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="font-medium">Jenis Sekolah:</span>
                    <div className="flex flex-wrap gap-1">
                      {schoolTypes.map((type) => (
                        <Badge key={type}>{type}</Badge>
                      ))}
                    </div>
                  </div>

                  {schoolTypes.includes("SMA") && smaSpecializations.length > 0 && (
                    <div className="flex items-start gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="font-medium">Peminatan:</span>
                      <div className="flex flex-wrap gap-1">
                        {smaSpecializations.map((spec) => (
                          <Badge key={spec} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {schoolTypes.includes("SMK") && smkMajors.length > 0 && (
                    <div className="flex items-start gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="font-medium">Jurusan:</span>
                      <div className="flex flex-wrap gap-1">
                        {smkMajors.map((major) => (
                          <Badge key={major.code} variant="secondary">
                            {major.code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      Simpan Konfigurasi
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SchoolSetup;
