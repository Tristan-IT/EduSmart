import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Download,
  Upload,
  MoreVertical,
  Copy,
  Archive,
  TrendingUp,
  Users,
  GraduationCap,
  BookMarked,
  Star,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Subject {
  _id: string;
  code: string;
  name: string;
  category: "WAJIB" | "PEMINATAN" | "MUATAN_LOKAL" | "EKSTRAKURIKULER";
  schoolTypes: Array<"SD" | "SMP" | "SMA" | "SMK">;
  grades: number[];
  smaSpecializations?: string[];
  smkMajors?: string[];
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
}

const CATEGORIES = [
  { value: "WAJIB", label: "Mata Pelajaran Wajib" },
  { value: "PEMINATAN", label: "Mata Pelajaran Peminatan" },
  { value: "MUATAN_LOKAL", label: "Muatan Lokal" },
  { value: "EKSTRAKURIKULER", label: "Ekstrakurikuler" },
];

const SCHOOL_TYPES = ["SD", "SMP", "SMA", "SMK"];

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

const PRESET_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#14b8a6", // teal
  "#6366f1", // indigo
];

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [schoolTypeFilter, setSchoolTypeFilter] = useState<string>("ALL");
  const [gradeFilter, setGradeFilter] = useState<string>("ALL");

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "WAJIB" as Subject["category"],
    schoolTypes: [] as string[],
    grades: [] as number[],
    description: "",
    color: PRESET_COLORS[0],
    icon: "BookOpen",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [subjects, searchQuery, categoryFilter, schoolTypeFilter, gradeFilter]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/subjects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setSubjects(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setError(err.message || "Gagal memuat mata pelajaran");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...subjects];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "ALL") {
      filtered = filtered.filter((s) => s.category === categoryFilter);
    }

    // School type filter
    if (schoolTypeFilter !== "ALL") {
      filtered = filtered.filter((s) => s.schoolTypes.includes(schoolTypeFilter as any));
    }

    // Grade filter
    if (gradeFilter !== "ALL") {
      filtered = filtered.filter((s) => s.grades.includes(parseInt(gradeFilter)));
    }

    setFilteredSubjects(filtered);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      category: "WAJIB",
      schoolTypes: [],
      grades: [],
      description: "",
      color: PRESET_COLORS[0],
      icon: "BookOpen",
    });
  };

  const handleCreate = async () => {
    try {
      setError("");
      setSuccess("");

      // Enhanced validation with specific messages
      if (!formData.code) {
        setError("❌ Kode mata pelajaran wajib diisi");
        return;
      }
      if (formData.code.length < 2) {
        setError("❌ Kode minimal 2 karakter (contoh: MAT, IPA)");
        return;
      }
      if (!formData.name) {
        setError("❌ Nama mata pelajaran wajib diisi");
        return;
      }
      if (formData.schoolTypes.length === 0) {
        setError("❌ Pilih minimal 1 jenis sekolah");
        return;
      }
      if (formData.grades.length === 0) {
        setError("❌ Pilih minimal 1 tingkat kelas");
        return;
      }
      
      // Check for duplicate code
      if (subjects.some(s => s.code === formData.code)) {
        setError("❌ Kode mata pelajaran sudah digunakan");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal membuat mata pelajaran");
      }

      setSuccess("Mata pelajaran berhasil dibuat!");
      setCreateDialogOpen(false);
      resetForm();
      fetchSubjects();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = async () => {
    try {
      setError("");
      setSuccess("");

      if (!selectedSubject) return;

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/subjects/${selectedSubject._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal mengupdate mata pelajaran");
      }

      setSuccess("Mata pelajaran berhasil diupdate!");
      setEditDialogOpen(false);
      setSelectedSubject(null);
      resetForm();
      fetchSubjects();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      setError("");
      setSuccess("");

      if (!selectedSubject) return;

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/subjects/${selectedSubject._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal menghapus mata pelajaran");
      }

      setSuccess("Mata pelajaran berhasil dihapus!");
      setDeleteDialogOpen(false);
      setSelectedSubject(null);
      fetchSubjects();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openEditDialog = (subject: Subject) => {
    setSelectedSubject(subject);
    setFormData({
      code: subject.code,
      name: subject.name,
      category: subject.category,
      schoolTypes: subject.schoolTypes,
      grades: subject.grades,
      description: subject.description || "",
      color: subject.color || PRESET_COLORS[0],
      icon: subject.icon || "BookOpen",
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (subject: Subject) => {
    setSelectedSubject(subject);
    setDeleteDialogOpen(true);
  };

  const toggleSchoolType = (type: string) => {
    if (formData.schoolTypes.includes(type)) {
      setFormData({ ...formData, schoolTypes: formData.schoolTypes.filter((t) => t !== type) });
    } else {
      setFormData({ ...formData, schoolTypes: [...formData.schoolTypes, type] });
    }
  };

  const toggleGrade = (grade: number) => {
    if (formData.grades.includes(grade)) {
      setFormData({ ...formData, grades: formData.grades.filter((g) => g !== grade) });
    } else {
      setFormData({ ...formData, grades: [...formData.grades, grade].sort((a, b) => a - b) });
    }
  };

  const getCategoryLabel = (category: string) => {
    return CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "WAJIB":
        return "bg-blue-100 text-blue-800";
      case "PEMINATAN":
        return "bg-purple-100 text-purple-800";
      case "MUATAN_LOKAL":
        return "bg-green-100 text-green-800";
      case "EKSTRAKURIKULER":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    total: subjects.length,
    wajib: subjects.filter(s => s.category === 'WAJIB').length,
    peminatan: subjects.filter(s => s.category === 'PEMINATAN').length,
    muatanLokal: subjects.filter(s => s.category === 'MUATAN_LOKAL').length,
    ekstra: subjects.filter(s => s.category === 'EKSTRAKURIKULER').length,
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Manajemen Mata Pelajaran</h1>
                  <p className="text-sm text-muted-foreground">Kelola mata pelajaran sekolah</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Mapel
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              {/* Statistics Cards */}
              <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total Mapel</p>
                        <p className="text-3xl font-bold mt-1">{stats.total}</p>
                      </div>
                      <BookOpen className="h-10 w-10 opacity-80" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Wajib</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{stats.wajib}</p>
                      </div>
                      <Star className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Peminatan</p>
                        <p className="text-2xl font-bold text-purple-600 mt-1">{stats.peminatan}</p>
                      </div>
                      <GraduationCap className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Muatan Lokal</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{stats.muatanLokal}</p>
                      </div>
                      <BookMarked className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Ekstrakurikuler</p>
                        <p className="text-2xl font-bold text-orange-600 mt-1">{stats.ekstra}</p>
                      </div>
                      <Users className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter & Pencarian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Cari Mata Pelajaran</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nama atau kode..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Semua Kategori</SelectItem>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Jenis Sekolah</Label>
                  <Select value={schoolTypeFilter} onValueChange={setSchoolTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Semua Jenis</SelectItem>
                      {SCHOOL_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Kelas</Label>
                  <Select value={gradeFilter} onValueChange={setGradeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Semua Kelas</SelectItem>
                      {GRADES.map((grade) => (
                        <SelectItem key={grade} value={grade.toString()}>
                          Kelas {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Daftar Mata Pelajaran</CardTitle>
                  <CardDescription>
                    {filteredSubjects.length} dari {subjects.length} mata pelajaran
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={fetchSubjects}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Memuat data...</p>
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Belum ada mata pelajaran</h3>
                  <p className="text-muted-foreground mb-4">Mulai dengan menambahkan mata pelajaran pertama</p>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Mata Pelajaran
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kode</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Jenis Sekolah</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubjects.map((subject) => (
                        <TableRow key={subject._id} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: subject.color || "#3b82f6" }}
                              />
                              <Badge variant="outline" className="font-mono">
                                {subject.code}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell>
                            <Badge className={getCategoryColor(subject.category)}>
                              {getCategoryLabel(subject.category)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {subject.schoolTypes.map((type) => (
                                <Badge key={type} variant="secondary">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {subject.grades.length > 3
                                ? `${subject.grades[0]}-${subject.grades[subject.grades.length - 1]}`
                                : subject.grades.join(", ")}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(subject)}
                                className="hover:bg-blue-100"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(subject.code);
                                  setSuccess('Kode mata pelajaran berhasil disalin!');
                                  setTimeout(() => setSuccess(''), 2000);
                                }}
                                className="hover:bg-green-100"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(subject)}
                                className="hover:bg-red-100"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Tambah Mata Pelajaran Baru</DialogTitle>
                <DialogDescription className="text-base mt-1">
                  Lengkapi form di bawah untuk menambahkan mata pelajaran
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            {/* Section 1: Basic Information */}
            <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-100">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-900">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Informasi Dasar
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-semibold flex items-center gap-1">
                    Kode <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    placeholder="Contoh: MAT, IPA, B.IND"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="h-11 border-2 focus-visible:ring-2"
                  />
                  <p className="text-xs text-muted-foreground">Kode singkat (2-5 karakter)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Contoh: Matematika"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11 border-2 focus-visible:ring-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold flex items-center gap-1">
                  Kategori <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-11 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Section 2: Applicable Schools & Grades */}
            <div className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border-2 border-green-100">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-900">
                <GraduationCap className="h-5 w-5 text-green-600" />
                Cakupan Jenjang & Kelas
              </h3>
              
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-1">
                  Jenis Sekolah <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {SCHOOL_TYPES.map((type) => (
                    <label
                      key={type}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.schoolTypes.includes(type)
                          ? 'bg-green-100 border-green-500 text-green-900'
                          : 'bg-white border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <Checkbox
                        checked={formData.schoolTypes.includes(type)}
                        onCheckedChange={() => toggleSchoolType(type)}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <span className="text-sm font-semibold">{type}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Pilih jenjang sekolah yang berlaku</p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-1">
                  Tingkat Kelas <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-6 gap-2">
                  {GRADES.map((grade) => (
                    <label
                      key={grade}
                      className={`flex items-center justify-center gap-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.grades.includes(grade)
                          ? 'bg-blue-100 border-blue-500 text-blue-900'
                          : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <Checkbox
                        checked={formData.grades.includes(grade)}
                        onCheckedChange={() => toggleGrade(grade)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                      <span className="text-sm font-semibold">{grade}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Dipilih: {formData.grades.length > 0 ? formData.grades.sort((a,b) => a-b).join(', ') : 'Belum ada'}
                </p>
              </div>
            </div>

            {/* Section 3: Additional Details */}
            <div className="space-y-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-100">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-900">
                <Star className="h-5 w-5 text-amber-600" />
                Detail Tambahan
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  Deskripsi
                </Label>
                <Textarea
                  id="description"
                  placeholder="Tambahkan deskripsi singkat tentang mata pelajaran ini..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="border-2 focus-visible:ring-2 resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  Warna Tema
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: formData.color }}
                  />
                </Label>
                <div className="flex flex-wrap gap-3">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                        formData.color === color 
                          ? "border-gray-900 ring-2 ring-offset-2 ring-gray-400 scale-110" 
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Pilih warna untuk identitas visual mata pelajaran</p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-6">
            <Button 
              variant="outline" 
              onClick={() => setCreateDialogOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button 
              onClick={handleCreate}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Mata Pelajaran
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Mata Pelajaran</DialogTitle>
            <DialogDescription>
              Update informasi mata pelajaran {selectedSubject?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Kode *</Label>
                <Input
                  id="edit-code"
                  placeholder="MAT, B.IND, IPA, dll"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama *</Label>
                <Input
                  id="edit-name"
                  placeholder="Matematika"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Kategori *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Jenis Sekolah *</Label>
              <div className="grid grid-cols-4 gap-2">
                {SCHOOL_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.schoolTypes.includes(type)}
                      onCheckedChange={() => toggleSchoolType(type)}
                    />
                    <label className="text-sm font-medium">{type}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Kelas *</Label>
              <div className="grid grid-cols-6 gap-2">
                {GRADES.map((grade) => (
                  <div key={grade} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.grades.includes(grade)}
                      onCheckedChange={() => toggleGrade(grade)}
                    />
                    <label className="text-sm font-medium">{grade}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Deskripsi</Label>
              <Textarea
                id="edit-description"
                placeholder="Deskripsi mata pelajaran..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Warna</Label>
              <div className="flex gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color ? "border-gray-900" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEdit}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Mata Pelajaran</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus mata pelajaran{" "}
              <span className="font-semibold">{selectedSubject?.name}</span>? Mata pelajaran
              yang dihapus akan di-nonaktifkan dan tidak dapat digunakan lagi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SubjectManagement;
