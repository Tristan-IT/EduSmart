import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  GraduationCap,
  Search,
  Filter,
  Download,
  Upload,
  TrendingUp,
  Award,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Student {
  _id: string;
  studentId: string;
  name: string;
  email: string;
  nis: string;
  class: {
    className: string;
    grade: number;
  };
  parentName: string;
  parentPhone: string;
  isActive: boolean;
}

const SchoolOwnerStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchQuery, gradeFilter, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
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
      
      if (!schoolId) {
        setError("School ID tidak ditemukan. Silakan login kembali.");
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/school-dashboard/students?schoolId=${schoolId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch students");

      const data = await response.json();
      setStudents(data.data?.students || data.students || []);
      setFilteredStudents(data.data?.students || data.students || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.nis.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (gradeFilter !== "all") {
      filtered = filtered.filter(
        (student) => student.class?.grade?.toString() === gradeFilter
      );
    }

    setFilteredStudents(filtered);
  };

  const handleExport = () => {
    const csv = [
      ["NIS", "Nama", "Email", "Kelas", "Orang Tua", "No. Telepon", "Status"],
      ...filteredStudents.map((s) => [
        s.nis,
        s.name,
        s.email,
        s.class?.className || "-",
        s.parentName,
        s.parentPhone,
        s.isActive ? "Aktif" : "Nonaktif",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data-siswa-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <AppSidebar role="school-owner" />
        
        <main className="flex-1 overflow-auto">
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
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Manajemen Siswa
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Kelola data siswa dan performa akademik
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

            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid gap-4 md:grid-cols-4"
            >
              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-emerald-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Siswa Baru (Bulan Ini)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-emerald-600">
                      {students.filter((s) => {
                        const createdDate = new Date(s.createdAt);
                        const now = new Date();
                        return createdDate.getMonth() === now.getMonth() && 
                               createdDate.getFullYear() === now.getFullYear();
                      }).length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">dari {students.length} total</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Siswa Aktif (7 Hari)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {students.filter((s) => s.isActive).length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">login minggu ini</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Siswa Dengan Wali
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {students.filter((s) => s.parentName && s.parentPhone).length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">data lengkap</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Rasio Siswa/Kelas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {[...new Set(students.map(s => s.class?.classId))].filter(Boolean).length > 0
                        ? Math.round(students.length / [...new Set(students.map(s => s.class?.classId))].filter(Boolean).length)
                        : 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">siswa per kelas</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari nama, NIS, atau email siswa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={gradeFilter} onValueChange={setGradeFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      <SelectItem value="10">Kelas 10</SelectItem>
                      <SelectItem value="11">Kelas 11</SelectItem>
                      <SelectItem value="12">Kelas 12</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>

                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Students Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Daftar Siswa ({filteredStudents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-muted-foreground">Memuat data siswa...</p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Belum Ada Siswa</h3>
                    <p className="text-muted-foreground">
                      Data siswa akan muncul di sini
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>NIS</TableHead>
                          <TableHead>Nama Siswa</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Kelas</TableHead>
                          <TableHead>Orang Tua</TableHead>
                          <TableHead>Kontak</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student._id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{student.nis}</TableCell>
                            <TableCell>
                              <div className="font-medium">{student.name}</div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {student.email}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {student.class?.className || "-"}
                              </Badge>
                            </TableCell>
                            <TableCell>{student.parentName}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {student.parentPhone}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={student.isActive ? "bg-green-500" : "bg-gray-400"}>
                                {student.isActive ? "Aktif" : "Nonaktif"}
                              </Badge>
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
    </SidebarProvider>
  );
};

export default SchoolOwnerStudents;
