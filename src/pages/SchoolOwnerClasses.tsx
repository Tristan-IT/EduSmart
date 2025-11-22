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
  BookOpen,
  Search,
  Plus,
  Edit,
  Users,
  CheckCircle2,
  XCircle,
  Filter,
  GraduationCap,
  UserCheck,
  LayoutList,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  BarChart3,
  BookMarked,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import CreateClassWizard from "@/components/CreateClassWizard";
import EditClassModal from "@/components/EditClassModal";
import BulkCreateClassWizard from "@/components/BulkCreateClassWizard";

interface Subject {
  _id: string;
  code: string;
  name: string;
  category: string;
  color?: string;
}

interface Class {
  _id: string;
  classId: string;
  className?: string; // Legacy field
  displayName: string;
  shortName: string;
  grade: number;
  section: string;
  schoolType: "SD" | "SMP" | "SMA" | "SMK";
  specialization?: string; // For SMA
  majorCode?: string; // For SMK
  majorName?: string; // For SMK
  academicYear: string;
  homeRoomTeacher?: {
    name: string;
  };
  subjects?: Subject[];
  studentCount: number;
  totalStudents: number;
  maxCapacity: number;
  maxStudents: number;
  isActive: boolean;
}

// Grouped Class Section Component
const GroupedClassSection = ({ groupName, classes, onEdit }: { groupName: string; classes: Class[]; onEdit: (cls: Class) => void }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalStudents = classes.reduce((sum, cls) => sum + (cls.studentCount || 0), 0);
  const totalCapacity = classes.reduce((sum, cls) => sum + (cls.maxStudents || cls.maxCapacity || 0), 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;

  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
          <div>
            <h3 className="font-semibold text-lg">{groupName}</h3>
            <p className="text-sm text-muted-foreground">
              {classes.length} kelas · {totalStudents}/{totalCapacity} siswa · {occupancyRate}% terisi
            </p>
          </div>
        </div>
        <Badge variant={occupancyRate >= 90 ? "destructive" : occupancyRate >= 75 ? "default" : "secondary"}>
          {occupancyRate >= 90 ? "Hampir Penuh" : occupancyRate >= 75 ? "Cukup Penuh" : "Tersedia"}
        </Badge>
      </div>

      {isExpanded && (
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kelas</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Wali Kelas</TableHead>
                <TableHead className="text-center">Siswa</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls._id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="font-medium">{cls.displayName || cls.className}</div>
                    {cls.shortName && (
                      <div className="text-sm text-muted-foreground font-mono">{cls.shortName}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {cls.classId}
                  </TableCell>
                  <TableCell>
                    {cls.homeRoomTeacher ? (
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{cls.homeRoomTeacher.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Belum ditentukan</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className={cls.studentCount >= (cls.maxStudents || cls.maxCapacity) ? "font-semibold text-orange-600" : ""}>
                        {cls.studentCount || 0}/{cls.maxStudents || cls.maxCapacity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {cls.isActive ? (
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
                    <Button size="sm" variant="outline" onClick={() => onEdit(cls)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
};

const SchoolOwnerClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [majorFilter, setMajorFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "grouped">("grouped");
  const [schoolConfig, setSchoolConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  
  // Subject assignment state
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [assigningClass, setAssigningClass] = useState<Class | null>(null);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [assigningSubjects, setAssigningSubjects] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchSchoolConfig();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [searchQuery, gradeFilter, specializationFilter, majorFilter, classes]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const schoolId = localStorage.getItem("schoolId");
      
      const response = await fetch(`http://localhost:5000/api/school-dashboard/classes?schoolId=${schoolId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch classes");

      const data = await response.json();
      setClasses(data.data?.classes || data.classes || []);
      setFilteredClasses(data.data?.classes || data.classes || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolConfig = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/school-owner/setup", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setSchoolConfig(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch school config", err);
    }
  };

  const filterClasses = () => {
    let filtered = [...classes];

    // Search filter - improved to search displayName, shortName, and legacy className
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cls) =>
          (cls.displayName && cls.displayName.toLowerCase().includes(query)) ||
          (cls.shortName && cls.shortName.toLowerCase().includes(query)) ||
          (cls.className && cls.className.toLowerCase().includes(query)) ||
          cls.classId.toLowerCase().includes(query) ||
          cls.section.toLowerCase().includes(query) ||
          (cls.specialization && cls.specialization.toLowerCase().includes(query)) ||
          (cls.majorCode && cls.majorCode.toLowerCase().includes(query)) ||
          (cls.majorName && cls.majorName.toLowerCase().includes(query))
      );
    }

    // Grade filter
    if (gradeFilter !== "all") {
      filtered = filtered.filter((cls) => cls.grade.toString() === gradeFilter);
    }

    // Specialization filter (SMA)
    if (specializationFilter !== "all") {
      filtered = filtered.filter((cls) => cls.specialization === specializationFilter);
    }

    // Major filter (SMK)
    if (majorFilter !== "all") {
      filtered = filtered.filter((cls) => cls.majorCode === majorFilter);
    }

    setFilteredClasses(filtered);
  };

  const groupClasses = () => {
    const grouped: Record<string, Class[]> = {};
    
    filteredClasses.forEach((cls) => {
      let groupKey = `Kelas ${cls.grade}`;
      
      if (cls.specialization) {
        groupKey += ` - ${cls.specialization}`;
      } else if (cls.majorCode) {
        groupKey += ` - ${cls.majorCode} (${cls.majorName})`;
      }
      
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(cls);
    });

    // Sort groups by grade and spec/major
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  };

  const getAvailableSpecializations = () => {
    const specs = new Set<string>();
    classes.forEach((cls) => {
      if (cls.specialization) specs.add(cls.specialization);
    });
    return Array.from(specs).sort();
  };

  const getAvailableMajors = () => {
    const majors = new Map<string, string>();
    classes.forEach((cls) => {
      if (cls.majorCode && cls.majorName) {
        majors.set(cls.majorCode, cls.majorName);
      }
    });
    return Array.from(majors.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  };

  const handleAddClass = async (formData: any) => {
    try {
      const token = localStorage.getItem("token");
      const schoolId = localStorage.getItem("schoolId");

      const response = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          schoolId,
          grade: formData.grade,
          section: formData.section,
          specialization: formData.specialization,
          majorCode: formData.majorCode,
          majorName: formData.majorName,
          maxStudents: formData.maxStudents,
          academicYear: formData.academicYear,
          homeRoomTeacherId: formData.homeRoomTeacherId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat kelas");
      }

      setIsAddDialogOpen(false);
      setError("");
      fetchClasses();
    } catch (err: any) {
      throw err; // Let wizard handle the error
    }
  };

  const handleEditClass = (cls: Class) => {
    setEditingClass(cls);
    setIsEditDialogOpen(true);
  };

  const handleUpdateClass = async (formData: Partial<Class>) => {
    if (!editingClass) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/classes/${editingClass._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengupdate kelas");
      }

      setIsEditDialogOpen(false);
      setEditingClass(null);
      setError("");
      fetchClasses();
    } catch (err: any) {
      throw err; // Let modal handle the error
    }
  };

  const handleAssignSubjects = async (cls: Class) => {
    setAssigningClass(cls);
    setSelectedSubjectIds(cls.subjects?.map(s => s._id) || []);
    
    // Fetch applicable subjects for this class
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/subjects?schoolType=${cls.schoolType}&grade=${cls.grade}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const data = await response.json();
      if (data.success) {
        setAvailableSubjects(data.data);
      }
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
    
    setIsSubjectDialogOpen(true);
  };

  const handleSaveSubjects = async () => {
    if (!assigningClass) return;
    
    try {
      setAssigningSubjects(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `http://localhost:5000/api/classes/${assigningClass.classId}/subjects`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subjectIds: selectedSubjectIds }),
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Gagal menyimpan mata pelajaran");
      }
      
      setIsSubjectDialogOpen(false);
      setAssigningClass(null);
      setSelectedSubjectIds([]);
      fetchClasses();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAssigningSubjects(false);
    }
  };

  const toggleSubject = (subjectId: string) => {
    if (selectedSubjectIds.includes(subjectId)) {
      setSelectedSubjectIds(selectedSubjectIds.filter(id => id !== subjectId));
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, subjectId]);
    }
  };

  const handleBulkCreate = async (bulkData: any) => {
    try {
      const token = localStorage.getItem("token");
      const schoolId = localStorage.getItem("schoolId");

      const response = await fetch("http://localhost:5000/api/classes/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          schoolId,
          ...bulkData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat kelas secara bulk");
      }

      setIsBulkDialogOpen(false);
      setError("");
      
      // Show success message with summary
      const { summary } = data;
      alert(`Berhasil membuat ${summary.succeeded} kelas dari ${summary.total} yang dicoba. ${summary.failed > 0 ? `${summary.failed} gagal dibuat.` : ''}`);
      
      fetchClasses();
    } catch (err: any) {
      setError(err.message || "Gagal membuat kelas secara bulk");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
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
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Manajemen Kelas
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Kelola kelas dan pembagian siswa
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/analytics"}
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Lihat Analytics
                </Button>
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
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Kelas Penuh (100%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {classes.filter((c) => c.studentCount >= (c.maxStudents || c.maxCapacity || 0)).length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">dari {classes.length} kelas</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Kelas Tersedia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {classes.filter((c) => c.studentCount < (c.maxStudents || c.maxCapacity || 0)).length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">masih bisa terima siswa</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Kapasitas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {classes.reduce((sum, c) => sum + (c.maxStudents || c.maxCapacity || 0), 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">kursi tersedia</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Tingkat Okupansi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">
                      {classes.reduce((sum, c) => sum + (c.maxStudents || c.maxCapacity || 0), 0) > 0
                        ? Math.round(
                            (classes.reduce((sum, c) => sum + (c.studentCount || 0), 0) /
                              classes.reduce((sum, c) => sum + (c.maxStudents || c.maxCapacity || 0), 0)) *
                              100
                          )
                        : 0}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">terisi</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  {/* Search and View Toggle Row */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Cari nama kelas, peminatan, jurusan, atau section..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex gap-2 bg-muted p-1 rounded-lg w-fit">
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="h-8"
                      >
                        <LayoutList className="h-4 w-4 mr-2" />
                        List
                      </Button>
                      <Button
                        variant={viewMode === "grouped" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grouped")}
                        className="h-8"
                      >
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        Grouped
                      </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="border-purple-600 text-purple-600 hover:bg-purple-50 whitespace-nowrap"
                        onClick={() => setIsBulkDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Bulk Create
                      </Button>

                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 whitespace-nowrap"
                        onClick={() => setIsAddDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kelas
                      </Button>
                    </div>
                  </div>

                  {/* Filter Dropdowns Row */}
                  <div className="flex flex-wrap gap-3">
                    <Select value={gradeFilter} onValueChange={setGradeFilter}>
                      <SelectTrigger className="w-[160px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Tingkat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Tingkat</SelectItem>
                        {schoolConfig?.schoolType === "SD" && (
                          <>
                            <SelectItem value="1">Kelas 1</SelectItem>
                            <SelectItem value="2">Kelas 2</SelectItem>
                            <SelectItem value="3">Kelas 3</SelectItem>
                            <SelectItem value="4">Kelas 4</SelectItem>
                            <SelectItem value="5">Kelas 5</SelectItem>
                            <SelectItem value="6">Kelas 6</SelectItem>
                          </>
                        )}
                        {schoolConfig?.schoolType === "SMP" && (
                          <>
                            <SelectItem value="7">Kelas 7</SelectItem>
                            <SelectItem value="8">Kelas 8</SelectItem>
                            <SelectItem value="9">Kelas 9</SelectItem>
                          </>
                        )}
                        {(schoolConfig?.schoolType === "SMA" || schoolConfig?.schoolType === "SMK") && (
                          <>
                            <SelectItem value="10">Kelas 10</SelectItem>
                            <SelectItem value="11">Kelas 11</SelectItem>
                            <SelectItem value="12">Kelas 12</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>

                    {/* Specialization Filter (SMA only) */}
                    {getAvailableSpecializations().length > 0 && (
                      <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                        <SelectTrigger className="w-[160px]">
                          <GraduationCap className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Peminatan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Peminatan</SelectItem>
                          {getAvailableSpecializations().map((spec) => (
                            <SelectItem key={spec} value={spec}>
                              {spec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {/* Major Filter (SMK only) */}
                    {getAvailableMajors().length > 0 && (
                      <Select value={majorFilter} onValueChange={setMajorFilter}>
                        <SelectTrigger className="w-[200px]">
                          <GraduationCap className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Jurusan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Jurusan</SelectItem>
                          {getAvailableMajors().map(([code, name]) => (
                            <SelectItem key={code} value={code}>
                              {code} - {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {/* Clear Filters Button */}
                    {(searchQuery || gradeFilter !== "all" || specializationFilter !== "all" || majorFilter !== "all") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("");
                          setGradeFilter("all");
                          setSpecializationFilter("all");
                          setMajorFilter("all");
                        }}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Classes Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Daftar Kelas ({filteredClasses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-muted-foreground">Memuat data kelas...</p>
                  </div>
                ) : filteredClasses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Belum Ada Kelas</h3>
                    <p className="text-muted-foreground mb-4">
                      Buat kelas pertama untuk memulai
                    </p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Kelas
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* List View */}
                    {viewMode === "list" && (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID Kelas</TableHead>
                              <TableHead>Nama Kelas</TableHead>
                              <TableHead>Tingkat</TableHead>
                              <TableHead>Wali Kelas</TableHead>
                              <TableHead>Mata Pelajaran</TableHead>
                              <TableHead className="text-center">Siswa</TableHead>
                              <TableHead>Tahun Ajaran</TableHead>
                              <TableHead className="text-center">Status</TableHead>
                              <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredClasses.map((cls) => (
                              <TableRow key={cls._id} className="hover:bg-muted/50">
                                <TableCell className="font-medium">{cls.classId}</TableCell>
                                <TableCell>
                                  <div className="font-medium">{cls.displayName || cls.className}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {cls.shortName && <span className="font-mono">{cls.shortName}</span>}
                                    {cls.specialization && (
                                      <Badge variant="secondary" className="ml-2">
                                        {cls.specialization}
                                      </Badge>
                                    )}
                                    {cls.majorCode && (
                                      <Badge variant="secondary" className="ml-2">
                                        {cls.majorCode}
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">Kelas {cls.grade}</Badge>
                                </TableCell>
                                <TableCell>
                                  {cls.homeRoomTeacher ? (
                                    <div className="flex items-center gap-2">
                                      <UserCheck className="h-4 w-4 text-green-600" />
                                      <span className="text-sm">
                                        {cls.homeRoomTeacher.name}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">
                                      Belum ditentukan
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {cls.subjects && cls.subjects.length > 0 ? (
                                      cls.subjects.slice(0, 3).map((subject) => (
                                        <Badge
                                          key={subject._id}
                                          variant="secondary"
                                          style={{
                                            borderLeft: `3px solid ${subject.color || "#3b82f6"}`,
                                          }}
                                        >
                                          {subject.code}
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-sm text-muted-foreground">Belum ada</span>
                                    )}
                                    {cls.subjects && cls.subjects.length > 3 && (
                                      <Badge variant="outline">+{cls.subjects.length - 3}</Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                      {cls.studentCount || 0}/{cls.maxStudents || cls.maxCapacity}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>{cls.academicYear}</TableCell>
                                <TableCell className="text-center">
                                  {cls.isActive ? (
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
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleAssignSubjects(cls)}
                                      title="Atur Mata Pelajaran"
                                    >
                                      <BookMarked className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleEditClass(cls)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {/* Grouped View */}
                    {viewMode === "grouped" && (
                      <div className="space-y-4">
                        {groupClasses().map(([groupName, groupClasses]) => (
                          <GroupedClassSection
                            key={groupName}
                            groupName={groupName}
                            classes={groupClasses}
                            onEdit={handleEditClass}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Add Class Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Kelas Baru</DialogTitle>
            <DialogDescription>
              Ikuti langkah-langkah untuk membuat kelas baru
            </DialogDescription>
          </DialogHeader>
          <CreateClassWizard
            onSubmit={handleAddClass}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Bulk Create Dialog */}
      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Create Kelas</DialogTitle>
            <DialogDescription>
              Buat beberapa kelas sekaligus dengan pengaturan yang sama
            </DialogDescription>
          </DialogHeader>
          <BulkCreateClassWizard
            onSubmit={handleBulkCreate}
            onCancel={() => setIsBulkDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Kelas</DialogTitle>
            <DialogDescription>
              Ubah informasi kelas yang sudah ada
            </DialogDescription>
          </DialogHeader>
          {editingClass && (
            <EditClassModal
              classData={editingClass}
              onSave={handleUpdateClass}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingClass(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Subjects Dialog */}
      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Atur Mata Pelajaran</DialogTitle>
            <DialogDescription>
              Pilih mata pelajaran untuk kelas {assigningClass?.displayName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {availableSubjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada mata pelajaran yang tersedia untuk kelas ini.
                <br />
                Silakan tambahkan mata pelajaran di menu Mata Pelajaran terlebih dahulu.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{selectedSubjectIds.length} mata pelajaran dipilih</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (selectedSubjectIds.length === availableSubjects.length) {
                        setSelectedSubjectIds([]);
                      } else {
                        setSelectedSubjectIds(availableSubjects.map(s => s._id));
                      }
                    }}
                  >
                    {selectedSubjectIds.length === availableSubjects.length
                      ? "Hapus Semua"
                      : "Pilih Semua"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-1">
                  {availableSubjects.map((subject) => (
                    <div
                      key={subject._id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedSubjectIds.includes(subject._id)
                          ? "bg-primary/5 border-primary"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => toggleSubject(subject._id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubjectIds.includes(subject._id)}
                        onChange={() => toggleSubject(subject._id)}
                        className="w-4 h-4 rounded border-gray-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: subject.color || "#3b82f6" }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{subject.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs font-mono">
                            {subject.code}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {subject.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsSubjectDialogOpen(false);
                setAssigningClass(null);
                setSelectedSubjectIds([]);
              }}
              disabled={assigningSubjects}
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveSubjects}
              disabled={assigningSubjects}
            >
              {assigningSubjects ? "Menyimpan..." : "Simpan Mata Pelajaran"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default SchoolOwnerClasses;
