import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Mata Pelajaran</h1>
            <p className="text-muted-foreground mt-1">
              Kelola mata pelajaran untuk sekolah Anda
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Mata Pelajaran
          </Button>
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
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Tidak ada mata pelajaran ditemukan</p>
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
                        <TableRow key={subject._id}>
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
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(subject)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(subject)}
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
    </div>
  );
};

export default SubjectManagement;
