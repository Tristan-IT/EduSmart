import { useState, useEffect, useMemo } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  Sparkles,
  Layers,
  Building2,
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

  const insights = useMemo(() => {
    const gradeSet = new Set<number>();
    const schoolTypeSet = new Set<string>();
    let active = 0;
    const categoryCounts = CATEGORIES.reduce((acc, cat) => {
      acc[cat.value as Subject["category"]] = 0;
      return acc;
    }, {} as Record<Subject["category"], number>);

    subjects.forEach((subject) => {
      if (subject.isActive) active += 1;
      subject.grades.forEach((grade) => gradeSet.add(grade));
      subject.schoolTypes.forEach((type) => schoolTypeSet.add(type));
      categoryCounts[subject.category] += 1;
    });

    const gradeCoverage = subjects.length
      ? Math.round((gradeSet.size / GRADES.length) * 100)
      : 0;
    const schoolTypeCoverage = subjects.length
      ? Math.round((schoolTypeSet.size / SCHOOL_TYPES.length) * 100)
      : 0;

    return {
      totalSubjects: subjects.length,
      activeSubjects: active,
      gradeCoverage,
      gradeCount: gradeSet.size,
      schoolTypeCoverage,
      schoolTypeCount: schoolTypeSet.size,
      categoryStats: CATEGORIES.map((cat) => ({
        ...cat,
        count: categoryCounts[cat.value as Subject["category"]] || 0,
      })),
    };
  }, [subjects]);

  const featuredSubjects = filteredSubjects.slice(0, 3);
  const quickCategoryFilters = [{ label: "Semua Kategori", value: "ALL" }, ...CATEGORIES];

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

      // Validation
      if (!formData.code || !formData.name || formData.schoolTypes.length === 0 || formData.grades.length === 0) {
        setError("Kode, nama, jenis sekolah, dan kelas wajib diisi");
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <AppSidebar role="school-owner" />

        <main className="flex-1 overflow-y-auto">
          <motion.div
            className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Portal School Owner</p>
                <h1 className="text-lg font-semibold text-slate-900">Manajemen Mata Pelajaran</h1>
              </div>
              <Button variant="outline" size="sm" onClick={fetchSubjects} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Segarkan Data
              </Button>
              <Button size="sm" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Tambah
              </Button>
            </div>
          </motion.div>

          <div className="p-6">
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
              <motion.section variants={fadeInUp}>
                <Card className="border-none bg-gradient-to-br from-indigo-600 via-purple-600 to-sky-500 text-white shadow-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                  <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between relative z-10">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-wider shadow-lg">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        Kurasi Kurikulum Lebih Rapi
                      </div>
                      <h2 className="text-4xl font-extrabold tracking-tight">Panel Mata Pelajaran Modern</h2>
                      <p className="max-w-2xl text-base text-white/90 leading-relaxed">
                        Pantau cakupan kurikulum, jalankan filter granular, dan lakukan aksi cepat tanpa meninggalkan side menu utama.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="secondary" className="gap-2 bg-white/20 backdrop-blur text-white hover:bg-white/30 border border-white/30 shadow-lg" onClick={fetchSubjects}>
                        <RefreshCw className="h-4 w-4" />
                        Sinkron Ulang
                      </Button>
                      <Button size="lg" className="gap-2 bg-white text-indigo-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all" onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="h-5 w-5" />
                        Tambah Mata Pelajaran
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.section>

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

              <motion.section variants={fadeInUp}>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      label: "Total Mata Pelajaran",
                      value: insights.totalSubjects,
                      description: "terdaftar",
                      icon: BookOpen,
                      accent: "from-indigo-500/10 via-indigo-500/5 to-purple-500/10",
                    },
                    {
                      label: "Aktif Digunakan",
                      value: insights.activeSubjects,
                      description: "status aktif",
                      icon: CheckCircle2,
                      accent: "from-emerald-500/10 via-emerald-500/5 to-teal-500/10",
                    },
                    {
                      label: "Kategori Terisi",
                      value: `${insights.categoryStats.filter((cat) => cat.count > 0).length}/${CATEGORIES.length}`,
                      description: "kategori",
                      icon: Layers,
                      accent: "from-sky-500/10 via-sky-500/5 to-cyan-500/10",
                    },
                    {
                      label: "Jenis Sekolah",
                      value: `${insights.schoolTypeCount}/${SCHOOL_TYPES.length}`,
                      description: "coverage",
                      icon: Building2,
                      accent: "from-amber-500/10 via-amber-500/5 to-orange-500/10",
                    },
                  ].map((item) => (
                    <Card key={item.label} className="border border-slate-100 shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                        <div className={`rounded-full bg-gradient-to-br ${item.accent} p-2`}>
                          <item.icon className="h-4 w-4 text-slate-900" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-semibold text-slate-900">{item.value}</div>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={fadeInUp}>
                <Card className="border border-slate-200 bg-white/70 shadow-sm">
                  <CardContent className="grid gap-6 p-6 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-indigo-500" />
                        <div>
                          <h3 className="font-semibold">Filter & Pemerataan Kurikulum</h3>
                          <p className="text-sm text-muted-foreground">Gunakan short-cut kategori untuk mengerucutkan pencarian.</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {quickCategoryFilters.map((filter) => {
                          const isActive = categoryFilter === filter.value;
                          const relatedCount = filter.value === "ALL"
                            ? insights.totalSubjects
                            : insights.categoryStats.find((cat) => cat.value === filter.value)?.count || 0;
                          return (
                            <Button
                              key={filter.value}
                              type="button"
                              size="sm"
                              variant={isActive ? "default" : "outline"}
                              onClick={() => setCategoryFilter(filter.value)}
                              className="gap-2"
                            >
                              {filter.label}
                              <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                {relatedCount}
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Jenis Sekolah</Label>
                          <Select value={schoolTypeFilter} onValueChange={setSchoolTypeFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="Semua jenis" />
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
                              <SelectValue placeholder="Semua kelas" />
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
                    </div>
                    <div className="space-y-4">
                      <Label>Cari Mata Pelajaran</Label>
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Nama atau kode..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Label>Kategori Detail</Label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Semua kategori" />
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
                  </CardContent>
                </Card>
              </motion.section>

              <motion.section variants={fadeInUp}>
                <Card className="border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/40">
                  <CardContent className="grid gap-6 p-6 lg:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Cakupan Kelas Nasional</p>
                          <h3 className="text-3xl font-semibold text-slate-900">{insights.gradeCoverage}%</h3>
                        </div>
                        <Badge variant="secondary" className="text-xs">{insights.gradeCount} / {GRADES.length} kelas</Badge>
                      </div>
                      <Progress value={insights.gradeCoverage} className="h-2 bg-slate-200" />
                      <p className="text-sm text-muted-foreground">Pastikan setiap jenjang memiliki minimal satu mata pelajaran aktif.</p>
                    </div>
                    <div className="rounded-xl border border-white/70 bg-white/70 p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Jenis Sekolah Ter-cover</p>
                          <h3 className="text-2xl font-semibold text-slate-900">{insights.schoolTypeCoverage}%</h3>
                        </div>
                        <Badge variant="outline" className="text-xs">{insights.schoolTypeCount} Jenis</Badge>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        {SCHOOL_TYPES.map((type) => (
                          <div
                            key={type}
                            className={`rounded-lg border px-3 py-2 font-medium ${subjects.some((subject) => subject.schoolTypes.includes(type as any)) ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white"}`}
                          >
                            {type}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.section>

              <motion.section variants={fadeInUp}>
                <Tabs defaultValue="list" className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Eksplorasi Mata Pelajaran</h3>
                      <p className="text-sm text-muted-foreground">{filteredSubjects.length} dari {subjects.length} mata pelajaran sesuai filter.</p>
                    </div>
                    <TabsList>
                      <TabsTrigger value="list">Daftar</TabsTrigger>
                      <TabsTrigger value="kanban">Kategori</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="list">
                    <Card>
                      <CardHeader className="flex items-center justify-between">
                        <div>
                          <CardTitle>Daftar Mata Pelajaran</CardTitle>
                          <CardDescription>Kelola detail mata pelajaran secara terpusat.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={fetchSubjects} className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Muat ulang
                          </Button>
                          <Button size="sm" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Tambah
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="flex items-center justify-center py-12">
                            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500" />
                          </div>
                        ) : filteredSubjects.length === 0 ? (
                          <div className="py-12 text-center">
                            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground">Tidak ada mata pelajaran sesuai filter aktif.</p>
                          </div>
                        ) : (
                          <div className="overflow-hidden rounded-lg border">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-slate-50">
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
                                  <TableRow key={subject._id} className="hover:bg-slate-50/80">
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="h-3 w-3 rounded-full"
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
                                      <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(subject)}>
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(subject)}>
                                          <Trash2 className="h-4 w-4 text-destructive" />
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
                  </TabsContent>

                  <TabsContent value="kanban">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {insights.categoryStats.map((category) => {
                        const categorySubjects = filteredSubjects.filter((subject) => subject.category === category.value);
                        return (
                          <Card key={category.value} className="flex h-full flex-col border border-slate-200">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-base">{category.label}</CardTitle>
                                  <CardDescription>{categorySubjects.length} mata pelajaran aktif</CardDescription>
                                </div>
                                <Badge variant="secondary">{categorySubjects.length}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-3">
                              {categorySubjects.length ? (
                                categorySubjects.slice(0, 5).map((subject) => (
                                  <div key={subject._id} className="rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-3">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium">{subject.name}</p>
                                      <span className="text-xs text-muted-foreground">{subject.code}</span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-1 text-xs text-muted-foreground">
                                      {subject.schoolTypes.map((type) => (
                                        <span key={type} className="rounded-full bg-slate-100 px-2 py-0.5">
                                          {type}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">Belum ada mata pelajaran.</p>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.section>

              <motion.section variants={fadeInUp}>
                <Card className="border border-slate-200">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      <div>
                        <CardTitle>Highlight Mata Pelajaran</CardTitle>
                        <CardDescription>Prioritaskan mata pelajaran dengan permintaan tinggi.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {featuredSubjects.length ? (
                      featuredSubjects.map((subject) => (
                        <div key={subject._id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                          <div>
                            <p className="font-semibold">{subject.name}</p>
                            <p className="text-xs text-muted-foreground">{getCategoryLabel(subject.category)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono">{subject.code}</Badge>
                            <Button size="sm" variant="ghost" onClick={() => openEditDialog(subject)}>
                              Kelola
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Pilih filter untuk menampilkan highlight.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.section>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Mata Pelajaran Baru</DialogTitle>
            <DialogDescription>
              Isi informasi mata pelajaran yang akan ditambahkan
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Kode *</Label>
                <Input
                  id="code"
                  placeholder="MAT, B.IND, IPA, dll"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama *</Label>
                <Input
                  id="name"
                  placeholder="Matematika"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
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
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {type}
                    </label>
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
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
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
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleCreate}>Tambah Mata Pelajaran</Button>
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
    </SidebarProvider>
  );
};

export default SubjectManagement;
