import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DataTable, DataTableColumn } from "@/components/DataTable";
import { AlertMessage } from "@/components/AlertMessage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockContentItems, ContentItem } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { CTA_COPY_VARIANTS } from "@/data/ctaCopy";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BookOpen, Upload, FileDown, Plus, GraduationCap } from "lucide-react";
import { UploadContentDialog } from "@/components/UploadContentDialog";
import { EditContentDialog } from "@/components/EditContentDialog";
import { toast } from "sonner";
import { 
  getAllContent, 
  addContent, 
  updateContent, 
  deleteContent, 
  initializeContentStorage,
  searchContent 
} from "@/lib/contentService";
import { subjectApi } from "@/lib/apiClient";

interface Subject {
  _id: string;
  code: string;
  name: string;
  category: string;
  color: string;
}

const ContentLibrary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  // Initialize storage and load content
  useEffect(() => {
    initializeContentStorage(mockContentItems);
    loadContent();
    loadSubjects();
  }, []);

  const loadContent = () => {
    const items = getAllContent();
    setContentItems(items);
  };

  const loadSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const response = await subjectApi.getAll();
      if (response.success) {
        setSubjects(response.subjects);
      }
    } catch (error) {
      console.error("Failed to load subjects:", error);
      // Silently fail - subjects filter will just be empty
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleUpload = (content: Omit<ContentItem, 'id' | 'updatedAt'>) => {
    const newContent = addContent(content);
    loadContent();
    toast.success(`Materi "${newContent.title}" berhasil ditambahkan!`);
  };

  const handleEdit = (content: ContentItem) => {
    setEditingContent(content);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (content: ContentItem) => {
    updateContent(content.id, content);
    loadContent();
    toast.success(`Materi "${content.title}" berhasil diperbarui!`);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus materi "${title}"?`)) {
      deleteContent(id);
      loadContent();
      toast.success(`Materi "${title}" berhasil dihapus!`);
    }
  };

  const filteredItems = useMemo(() => {
    let items = searchContent(searchTerm, {
      difficulty: difficulty === 'all' ? undefined : difficulty,
    });
    
    // Filter by subject if selected
    if (selectedSubject !== 'all') {
      // In real implementation, this would filter by subjectId from API
      // For now, we'll keep all items as mock data doesn't have subject field yet
      items = items;
    }
    
    return items;
  }, [searchTerm, difficulty, selectedSubject, contentItems]);

  const columns: DataTableColumn<ContentItem>[] = [
    {
      key: "title",
      header: "Judul Materi",
      render: (row) => (
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{row.title}</p>
          <p className="text-xs text-muted-foreground">Diperbarui {new Date(row.updatedAt).toLocaleDateString('id-ID')}</p>
        </div>
      ),
    },
    {
      key: "topic",
      header: "Topik",
      render: (row) => <Badge variant="outline" className="capitalize">{row.topic}</Badge>,
    },
    {
      key: "difficulty",
      header: "Level",
      render: (row) => (
        <Badge
          variant={
            row.difficulty === "beginner" ? "secondary" : row.difficulty === "intermediate" ? "default" : "destructive"
          }
          className="capitalize"
        >
          {row.difficulty === "beginner" ? "Pemula" : row.difficulty === "intermediate" ? "Menengah" : "Lanjutan"}
        </Badge>
      ),
    },
    {
      key: "durationMinutes",
      header: "Durasi",
      align: "center",
      render: (row) => `${row.durationMinutes} menit`,
    },
    {
      key: "author",
      header: "Pengunggah",
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate(`/konten/${row.id}`)}>
            Lihat
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-destructive hover:text-destructive"
            onClick={() => handleDelete(row.id, row.title)}
          >
            Hapus
          </Button>
        </div>
      ),
      align: "right",
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar role="teacher" />
      <main className="flex-1 w-full">
        {/* Header */}
        <motion.div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-3 flex-1">
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Perpustakaan Konten
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container px-6 py-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Unggah materi, tandai kesesuaian kurikulum, dan hubungkan langsung dengan jalur belajar siswa.
              </p>
            </div>

            <AlertMessage
              type="info"
              title="Butuh bantuan mengelola konten?"
              message="Gunakan template unggah massal untuk mempercepat migrasi dari LMS lama."
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-52">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Semua mata pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject._id} value={subject._id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: subject.color }}
                          />
                          {subject.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Semua level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Level</SelectItem>
                    <SelectItem value="beginner">Pemula</SelectItem>
                    <SelectItem value="intermediate">Menengah</SelectItem>
                    <SelectItem value="advanced">Lanjutan</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant="outline" className="text-xs font-medium">
                  {filteredItems.length} materi ditemukan
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => toast.info("Fitur import CSV segera hadir!")}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Impor CSV
                </Button>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Materi
                </Button>
              </div>
            </div>

            <DataTable
              columns={columns}
              rows={filteredItems}
              sortable
              filters={null}
              emptyMessage="Belum ada materi yang cocok. Coba ubah filter atau unggah materi baru."
            />
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <UploadContentDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleUpload}
      />
      
      <EditContentDialog
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingContent(null);
        }}
        onSave={handleSaveEdit}
        content={editingContent}
      />
    </SidebarProvider>
  );
};

export default ContentLibrary;
