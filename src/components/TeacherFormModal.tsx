import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Subject {
  _id: string;
  name: string;
  code: string;
  color: string;
  icon: string;
  category: string;
}

interface Class {
  _id: string;
  classId: string;
  className: string;
  grade: string;
  section: string;
  currentStudents: number;
  maxStudents: number;
}

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "add" | "edit";
  teacherId?: string;
  teacherData?: {
    name: string;
    email: string;
    phone?: string;
    employeeId?: string;
    qualification?: string;
    address?: string;
    bio?: string;
    subjectRefs?: string[]; // Array of Subject _id
    classes?: string[]; // Array of Class _id
  };
}

export function TeacherFormModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
  teacherId,
  teacherData,
}: TeacherFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [qualification, setQualification] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");

  // Available options
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);

  // Selected items
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const schoolId = localStorage.getItem("schoolId") || "";

  // Load subjects and classes
  useEffect(() => {
    if (isOpen && schoolId) {
      loadSubjectsAndClasses();
    } else if (isOpen && !schoolId) {
      setError("School ID tidak ditemukan. Silakan login kembali.");
    }
  }, [isOpen, schoolId]);

  // Load existing teacher data for edit mode
  useEffect(() => {
    if (isOpen && mode === "edit" && teacherData) {
      setName(teacherData.name || "");
      setEmail(teacherData.email || "");
      setPhone(teacherData.phone || "");
      setEmployeeId(teacherData.employeeId || "");
      setQualification(teacherData.qualification || "");
      setAddress(teacherData.address || "");
      setBio(teacherData.bio || "");
      setSelectedSubjects(teacherData.subjectRefs || []);
      setSelectedClasses(teacherData.classes || []);
    } else if (isOpen && mode === "add") {
      // Reset form for add mode
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setEmployeeId("");
      setQualification("");
      setAddress("");
      setBio("");
      setSelectedSubjects([]);
      setSelectedClasses([]);
    }
  }, [isOpen, mode, teacherData]);

  const loadSubjectsAndClasses = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem("token");

      // Load subjects
      const subjectsRes = await fetch(
        `http://localhost:5000/api/subjects/public/school/${schoolId}`
      );
      if (subjectsRes.ok) {
        const subjectsData = await subjectsRes.json();
        setAvailableSubjects(subjectsData.data || subjectsData || []);
      }

      // Load classes
      const classesRes = await fetch(
        `http://localhost:5000/api/classes/public/school/${schoolId}`
      );
      if (classesRes.ok) {
        const classesData = await classesRes.json();
        setAvailableClasses(classesData.data || classesData || []);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Gagal memuat data mata pelajaran dan kelas");
    } finally {
      setLoadingData(false);
    }
  };

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const toggleClass = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const clearAllSubjects = () => {
    setSelectedSubjects([]);
  };

  const clearAllClasses = () => {
    setSelectedClasses([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!name.trim()) {
      setError("Nama lengkap harus diisi");
      return;
    }
    if (!email.trim()) {
      setError("Email harus diisi");
      return;
    }
    if (mode === "add" && !password) {
      setError("Password harus diisi untuk guru baru");
      return;
    }
    if (selectedSubjects.length === 0) {
      setError("Pilih minimal 1 mata pelajaran");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Get subject names from selected IDs
      const subjectNames = availableSubjects
        .filter((s) => selectedSubjects.includes(s._id))
        .map((s) => s.name);

      // Get class IDs (classId field, not _id)
      const classIds = availableClasses
        .filter((c) => selectedClasses.includes(c._id))
        .map((c) => c.classId);

      const payload: any = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        employeeId: employeeId.trim(),
        qualification: qualification.trim(),
        address: address.trim(),
        bio: bio.trim(),
        schoolId,
        subjects: subjectNames, // Send as array of names
        classIds: classIds, // Send as array of classId strings
      };

      if (mode === "add") {
        payload.password = password;
        
        // Use teacher registration endpoint for consistency
        const response = await fetch(
          "http://localhost:5000/api/teacher-registration/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal menambah guru");
        }

        setSuccess("Guru berhasil ditambahkan!");
      } else {
        // Edit mode
        const response = await fetch(
          `http://localhost:5000/api/teacher/${teacherId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal mengupdate guru");
        }

        setSuccess("Data guru berhasil diperbarui!");
      }

      // Wait a bit to show success message
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError("");
      setSuccess("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {mode === "add" ? "Tambah Guru Baru" : "Edit Data Guru"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Masukkan data lengkap untuk mendaftarkan guru baru"
              : "Perbarui informasi guru yang sudah terdaftar"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-900 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Data Diri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  disabled={loading || mode === "edit"}
                  required
                />
              </div>

              {mode === "add" && (
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    disabled={loading}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone">No. Telepon</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">NIP / ID Pegawai</Label>
                <Input
                  id="employeeId"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Masukkan NIP"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification">Kualifikasi Pendidikan</Label>
                <Input
                  id="qualification"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="S1 Pendidikan Matematika"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat lengkap"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio / Catatan</Label>
              <Input
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Informasi tambahan tentang guru"
                disabled={loading}
              />
            </div>
          </div>

          {/* Subject Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600 flex-shrink-0" />
                Mata Pelajaran <span className="text-red-500">*</span>
              </h3>
              <div className="flex items-center gap-2">
                {selectedSubjects.length > 0 && (
                  <>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                      {selectedSubjects.length} dipilih
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearAllSubjects}
                      disabled={loading}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Hapus Semua
                    </Button>
                  </>
                )}
              </div>
            </div>

            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                <span className="ml-2 text-muted-foreground">
                  Memuat mata pelajaran...
                </span>
              </div>
            ) : availableSubjects.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Belum ada mata pelajaran tersedia. Silakan tambahkan mata
                  pelajaran terlebih dahulu.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableSubjects.map((subject) => {
                  const isSelected = selectedSubjects.includes(subject._id);
                  return (
                    <Card
                      key={subject._id}
                      className={`p-4 cursor-pointer transition-all border-2 ${
                        isSelected
                          ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md"
                          : "border-gray-200 hover:border-purple-300 hover:shadow-sm"
                      }`}
                      onClick={() => !loading && toggleSubject(subject._id)}
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
            )}
          </div>

          {/* Class Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
                Kelas (Opsional)
              </h3>
              <div className="flex items-center gap-2">
                {selectedClasses.length > 0 && (
                  <>
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
                      {selectedClasses.length} dipilih
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearAllClasses}
                      disabled={loading}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Hapus Semua
                    </Button>
                  </>
                )}
              </div>
            </div>

            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-muted-foreground">
                  Memuat kelas...
                </span>
              </div>
            ) : availableClasses.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Belum ada kelas tersedia. Anda dapat menambahkan kelas nanti.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableClasses.map((classItem) => {
                  const isSelected = selectedClasses.includes(classItem._id);
                  const capacityPercentage =
                    (classItem.currentStudents / classItem.maxStudents) * 100;

                  return (
                    <Card
                      key={classItem._id}
                      className={`p-4 cursor-pointer transition-all border-2 ${
                        isSelected
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                      }`}
                      onClick={() => !loading && toggleClass(classItem._id)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-sm">
                              {classItem.className}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {classItem.grade} - {classItem.section}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Kapasitas</span>
                            <span>
                              {classItem.currentStudents}/{classItem.maxStudents}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                capacityPercentage >= 90
                                  ? "bg-red-500"
                                  : capacityPercentage >= 70
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${capacityPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading || loadingData}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "add" ? "Menambahkan..." : "Menyimpan..."}
                </>
              ) : (
                <>{mode === "add" ? "Tambah Guru" : "Simpan Perubahan"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
