import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, BookOpen, FileQuestion, Video, FileText, Eye, Download, Plus, Library } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { AlertMessage } from "@/components/AlertMessage";
import TemplatePreviewModal from "@/components/TemplatePreviewModal";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface Template {
  _id: string;
  title: string;
  description: string;
  type: "lesson" | "quiz" | "video" | "document";
  category: string;
  subject: string;
  gradeLevel: string;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  duration: number;
  tags: string[];
  thumbnail?: string;
  author: string;
  rating: number;
  downloads: number;
  isPublic: boolean;
  content?: any;
  createdAt: string;
}

export default function TemplateLibrary() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // Preview modal
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [templates, searchTerm, selectedType, selectedCategory, selectedGrade, selectedDifficulty]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API endpoint
      const response = await apiClient.get("/api/templates");
      // @ts-ignore - API response type
      setTemplates(response.data || []);
      setError(null);
    } catch (err: any) {
      // For now, use mock data
      const mockTemplates: Template[] = [
        {
          _id: "1",
          title: "Pengenalan Aljabar Dasar",
          description: "Materi lengkap tentang konsep dasar aljabar untuk SMP kelas 7",
          type: "lesson",
          category: "Matematika",
          subject: "Matematika",
          gradeLevel: "SMP",
          difficulty: "Mudah",
          duration: 45,
          tags: ["aljabar", "matematika", "dasar"],
          author: "Admin",
          rating: 4.5,
          downloads: 125,
          isPublic: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          title: "Quiz Persamaan Linear",
          description: "20 soal pilihan ganda tentang persamaan linear satu variabel",
          type: "quiz",
          category: "Matematika",
          subject: "Matematika",
          gradeLevel: "SMP",
          difficulty: "Sedang",
          duration: 30,
          tags: ["persamaan", "linear", "quiz"],
          author: "Admin",
          rating: 4.8,
          downloads: 98,
          isPublic: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "3",
          title: "Video Tutorial Pythagoras",
          description: "Video animasi menjelaskan teorema Pythagoras dengan contoh",
          type: "video",
          category: "Matematika",
          subject: "Matematika",
          gradeLevel: "SMP",
          difficulty: "Sedang",
          duration: 15,
          tags: ["pythagoras", "geometri", "video"],
          author: "Admin",
          rating: 4.9,
          downloads: 156,
          isPublic: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "4",
          title: "Sistem Pencernaan Manusia",
          description: "Materi lengkap tentang sistem pencernaan dengan diagram",
          type: "lesson",
          category: "IPA",
          subject: "Biologi",
          gradeLevel: "SMP",
          difficulty: "Sedang",
          duration: 60,
          tags: ["biologi", "pencernaan", "anatomi"],
          author: "Admin",
          rating: 4.6,
          downloads: 87,
          isPublic: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "5",
          title: "Teks Deskripsi - Bahasa Indonesia",
          description: "Pengenalan dan latihan menulis teks deskripsi",
          type: "lesson",
          category: "Bahasa",
          subject: "B.Indonesia",
          gradeLevel: "SMP",
          difficulty: "Mudah",
          duration: 40,
          tags: ["teks", "deskripsi", "menulis"],
          author: "Admin",
          rating: 4.4,
          downloads: 76,
          isPublic: true,
          createdAt: new Date().toISOString(),
        },
      ];
      setTemplates(mockTemplates);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...templates];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((t) => t.type === selectedType);
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    // Grade filter
    if (selectedGrade !== "all") {
      filtered = filtered.filter((t) => t.gradeLevel === selectedGrade);
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((t) => t.difficulty === selectedDifficulty);
    }

    setFilteredTemplates(filtered);
  };

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleDownload = async (templateId: string) => {
    try {
      setSuccess("Template downloaded successfully!");
      // TODO: Implement actual download
    } catch (err: any) {
      setError("Failed to download template");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return <BookOpen className="w-5 h-5" />;
      case "quiz":
        return <FileQuestion className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "document":
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Mudah":
        return "bg-green-100 text-green-800";
      case "Sedang":
        return "bg-yellow-100 text-yellow-800";
      case "Sulit":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
              <Library className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Template Library
              </h1>
            </div>
            <Button onClick={() => (window.location.href = "/teacher/upload-content")}>
              <Plus className="w-4 h-4 mr-2" />
              Upload Custom
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8 max-w-7xl space-y-6">
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Browse and use pre-made lesson templates, quizzes, and learning materials
          </motion.p>

      {/* Alerts */}
      {error && <AlertMessage type="danger" message={error} onClose={() => setError(null)} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Filters */}
      <div className="bg-card p-4 rounded-lg border space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="font-semibold">Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="lesson">Lessons</SelectItem>
              <SelectItem value="quiz">Quizzes</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Matematika">Matematika</SelectItem>
              <SelectItem value="IPA">IPA</SelectItem>
              <SelectItem value="IPS">IPS</SelectItem>
              <SelectItem value="Bahasa">Bahasa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger>
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="SD">SD</SelectItem>
              <SelectItem value="SMP">SMP</SelectItem>
              <SelectItem value="SMA">SMA</SelectItem>
              <SelectItem value="SMK">SMK</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Mudah">Mudah</SelectItem>
              <SelectItem value="Sedang">Sedang</SelectItem>
              <SelectItem value="Sulit">Sulit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Templates ({filteredTemplates.length})</TabsTrigger>
          <TabsTrigger value="lesson">
            Lessons ({filteredTemplates.filter((t) => t.type === "lesson").length})
          </TabsTrigger>
          <TabsTrigger value="quiz">
            Quizzes ({filteredTemplates.filter((t) => t.type === "quiz").length})
          </TabsTrigger>
          <TabsTrigger value="video">
            Videos ({filteredTemplates.filter((t) => t.type === "video").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <TemplateGrid
            templates={filteredTemplates}
            loading={loading}
            onPreview={handlePreview}
            onDownload={handleDownload}
            getTypeIcon={getTypeIcon}
            getDifficultyColor={getDifficultyColor}
          />
        </TabsContent>

        <TabsContent value="lesson" className="mt-6">
          <TemplateGrid
            templates={filteredTemplates.filter((t) => t.type === "lesson")}
            loading={loading}
            onPreview={handlePreview}
            onDownload={handleDownload}
            getTypeIcon={getTypeIcon}
            getDifficultyColor={getDifficultyColor}
          />
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <TemplateGrid
            templates={filteredTemplates.filter((t) => t.type === "quiz")}
            loading={loading}
            onPreview={handlePreview}
            onDownload={handleDownload}
            getTypeIcon={getTypeIcon}
            getDifficultyColor={getDifficultyColor}
          />
        </TabsContent>

        <TabsContent value="video" className="mt-6">
          <TemplateGrid
            templates={filteredTemplates.filter((t) => t.type === "video")}
            loading={loading}
            onPreview={handlePreview}
            onDownload={handleDownload}
            getTypeIcon={getTypeIcon}
            getDifficultyColor={getDifficultyColor}
          />
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewTemplate(null);
          }}
          onUse={() => {
            // Navigate to editor with template
            window.location.href = `/teacher/content-editor?templateId=${previewTemplate._id}`;
          }}
        />
      )}
        </div>
      </main>
      
      {/* Preview Modal */}
      <TemplatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={previewTemplate}
      />
    </SidebarProvider>
  );
}

// Template Grid Component
interface TemplateGridProps {
  templates: Template[];
  loading: boolean;
  onPreview: (template: Template) => void;
  onDownload: (templateId: string) => void;
  getTypeIcon: (type: string) => JSX.Element;
  getDifficultyColor: (difficulty: string) => string;
}

function TemplateGrid({
  templates,
  loading,
  onPreview,
  onDownload,
  getTypeIcon,
  getDifficultyColor,
}: TemplateGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No templates found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template._id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getTypeIcon(template.type)}
                <CardTitle className="text-lg">{template.title}</CardTitle>
              </div>
              <Badge className={getDifficultyColor(template.difficulty)}>{template.difficulty}</Badge>
            </div>
            <CardDescription className="line-clamp-2">{template.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {template.tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>⏱️ {template.duration} min</span>
              <span>⭐ {template.rating.toFixed(1)}</span>
              <span>📥 {template.downloads}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">{template.gradeLevel}</Badge>
              <Badge variant="secondary">{template.category}</Badge>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onPreview(template)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button className="flex-1" onClick={() => onDownload(template._id)}>
              <Download className="w-4 h-4 mr-2" />
              Use
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
