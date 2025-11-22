import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  BookOpen,
  CheckCircle2,
  XCircle,
  Filter,
  Download,
  Award,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Teacher {
  _id: string;
  teacherId: string;
  name: string;
  email: string;
  phone?: string;
  subjects: string[];
  totalClasses: number;
  totalStudents: number;
  isActive: boolean;
}

const SchoolOwnerTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Form states for add teacher
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    subjects: "",
  });

  // Form states for edit teacher
  const [editTeacher, setEditTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    subjects: "",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [searchQuery, statusFilter, teachers]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Try to get schoolId from localStorage (set during registration)
      // or from user data (for existing users)
      let schoolId = localStorage.getItem("schoolId");
      
      if (!schoolId) {
        // Fallback: get from user profile
        const userResponse = await fetch("http://localhost:5000/api/school-owner/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          schoolId = userData.schoolId;
        }
      }
      
      const response = await fetch(`http://localhost:5000/api/school-dashboard/teachers?schoolId=${schoolId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch teachers");

      const data = await response.json();
      setTeachers(data.data?.teachers || data.teachers || []);
      setFilteredTeachers(data.data?.teachers || data.teachers || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterTeachers = () => {
    let filtered = [...teachers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.teacherId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((teacher) =>
        statusFilter === "active" ? teacher.isActive : !teacher.isActive
      );
    }

    setFilteredTeachers(filtered);
  };

  const handleAddTeacher = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/teacher/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newTeacher,
          subjects: newTeacher.subjects.split(",").map((s) => s.trim()),
        }),
      });

      if (!response.ok) throw new Error("Failed to add teacher");

      setIsAddDialogOpen(false);
      setNewTeacher({ name: "", email: "", password: "", phone: "", subjects: "" });
      fetchTeachers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setEditTeacher({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone || "",
      subjects: teacher.subjects.join(", "),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTeacher = async () => {
    if (!selectedTeacher) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/teacher/${selectedTeacher._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editTeacher,
          subjects: editTeacher.subjects.split(",").map((s) => s.trim()),
        }),
      });

      if (!response.ok) throw new Error("Failed to update teacher");

      setIsEditDialogOpen(false);
      setSelectedTeacher(null);
      fetchTeachers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/teacher/${selectedTeacher._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete teacher");

      setIsDeleteDialogOpen(false);
      setSelectedTeacher(null);
      fetchTeachers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleExport = () => {
    // Simple CSV export
    const csv = [
      ["ID Guru", "Nama", "Email", "Mata Pelajaran", "Jumlah Kelas", "Status"],
      ...filteredTeachers.map((t) => [
        t.teacherId,
        t.name,
        t.email,
        t.subjects.join("; "),
        t.totalClasses.toString(),
        t.isActive ? "Aktif" : "Nonaktif",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data-guru-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AppSidebar role="school-owner" />
        
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <motion.header
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md"
          >
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Manajemen Guru
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Kelola data guru dan pengajar sekolah
                  </p>
                </div>
              </div>
            </div>
          </motion.header>

          <div className="p-6 space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Stats Overview */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid gap-4 md:grid-cols-4"
            >
              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Guru Aktif Minggu Ini
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {teachers.filter((t) => t.isActive).length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      dari {teachers.length} total
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Rata-rata Beban Kerja
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {teachers.length > 0
                        ? Math.round(
                            teachers.reduce((sum, t) => sum + t.totalClasses, 0) / teachers.length
                          )
                        : 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">kelas per guru</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Guru Multi-Mapel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {teachers.filter((t) => t.subjects && t.subjects.length > 1).length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">mengajar 2+ mapel</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Guru Ter-Produktif
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">
                      {teachers.length > 0
                        ? Math.max(...teachers.map((t) => t.totalStudents))
                        : 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">siswa terbanyak</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Filters & Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari nama, email, atau ID guru..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Nonaktif</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Export */}
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>

                  {/* Add Teacher */}
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Guru
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Tambah Guru Baru</DialogTitle>
                        <DialogDescription>
                          Masukkan data guru baru untuk sekolah Anda
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama Lengkap</Label>
                          <Input
                            id="name"
                            value={newTeacher.name}
                            onChange={(e) =>
                              setNewTeacher({ ...newTeacher, name: e.target.value })
                            }
                            placeholder="Masukkan nama lengkap"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newTeacher.email}
                            onChange={(e) =>
                              setNewTeacher({ ...newTeacher, email: e.target.value })
                            }
                            placeholder="email@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={newTeacher.password}
                            onChange={(e) =>
                              setNewTeacher({ ...newTeacher, password: e.target.value })
                            }
                            placeholder="Minimal 6 karakter"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">No. Telepon (Opsional)</Label>
                          <Input
                            id="phone"
                            value={newTeacher.phone}
                            onChange={(e) =>
                              setNewTeacher({ ...newTeacher, phone: e.target.value })
                            }
                            placeholder="08xxxxxxxxxx"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subjects">Mata Pelajaran</Label>
                          <Input
                            id="subjects"
                            value={newTeacher.subjects}
                            onChange={(e) =>
                              setNewTeacher({ ...newTeacher, subjects: e.target.value })
                            }
                            placeholder="Matematika, Fisika, Kimia (pisahkan dengan koma)"
                          />
                        </div>
                        <Button onClick={handleAddTeacher} className="w-full">
                          Simpan Guru
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Teachers Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Daftar Guru ({filteredTeachers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-muted-foreground">Memuat data guru...</p>
                  </div>
                ) : filteredTeachers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Belum Ada Guru</h3>
                    <p className="text-muted-foreground mb-4">
                      Mulai tambahkan guru pertama untuk sekolah Anda
                    </p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Guru
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Guru</TableHead>
                          <TableHead>Nama</TableHead>
                          <TableHead>Kontak</TableHead>
                          <TableHead>Mata Pelajaran</TableHead>
                          <TableHead className="text-center">Kelas</TableHead>
                          <TableHead className="text-center">Siswa</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTeachers.map((teacher) => (
                          <TableRow key={teacher._id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              {teacher.teacherId}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{teacher.name}</div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  {teacher.email}
                                </div>
                                {teacher.phone && (
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    {teacher.phone}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {teacher.subjects.map((subject, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {subject}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                {teacher.totalClasses}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {teacher.totalStudents}
                            </TableCell>
                            <TableCell className="text-center">
                              {teacher.isActive ? (
                                <Badge className="bg-green-500">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Aktif
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Nonaktif
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEditClick(teacher)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDeleteClick(teacher)}
                                >
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
          </div>
        </main>
      </div>

      {/* Edit Teacher Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Data Guru</DialogTitle>
            <DialogDescription>
              Update informasi guru {selectedTeacher?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input
                id="edit-name"
                value={editTeacher.name}
                onChange={(e) =>
                  setEditTeacher({ ...editTeacher, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editTeacher.email}
                onChange={(e) =>
                  setEditTeacher({ ...editTeacher, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">No. Telepon</Label>
              <Input
                id="edit-phone"
                value={editTeacher.phone}
                onChange={(e) =>
                  setEditTeacher({ ...editTeacher, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subjects">Mata Pelajaran</Label>
              <Input
                id="edit-subjects"
                value={editTeacher.subjects}
                onChange={(e) =>
                  setEditTeacher({ ...editTeacher, subjects: e.target.value })
                }
                placeholder="Matematika, Fisika, Kimia (pisahkan dengan koma)"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleUpdateTeacher} 
                className="flex-1"
              >
                Simpan Perubahan
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Konfirmasi Hapus Guru
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menonaktifkan guru ini?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="font-medium">{selectedTeacher?.name}</div>
              <div className="text-sm text-muted-foreground">
                {selectedTeacher?.email}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedTeacher?.subjects.map((subject, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
            <Alert>
              <AlertDescription>
                Guru akan dinonaktifkan dan tidak dapat login ke sistem. Data guru tetap tersimpan dan dapat diaktifkan kembali.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={handleDeleteTeacher}
                className="flex-1"
              >
                Ya, Nonaktifkan
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default SchoolOwnerTeachers;
