import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ContentItem } from "@/data/mockData";
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  User, 
  Tag, 
  Calendar,
  FileText,
  Video,
  Download,
  Share2,
  Play,
  FileQuestion,
  Presentation
} from "lucide-react";
import { toast } from "sonner";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { getContentById } from "@/lib/contentService";

const ContentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [content, setContent] = useState<ContentItem | null>(null);

  useEffect(() => {
    if (id) {
      const item = getContentById(id);
      setContent(item);
    }
  }, [id]);

  if (!content) {
    return (
      <SidebarProvider>
        <AppSidebar role="teacher" />
        <main className="flex-1 w-full">
          <div className="flex items-center justify-center min-h-screen">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Konten Tidak Ditemukan</CardTitle>
                <CardDescription>Materi yang Anda cari tidak tersedia.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/konten")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Perpustakaan
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarProvider>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'quiz':
        return <FileQuestion className="h-5 w-5" />;
      case 'slide':
        return <Presentation className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-500/10 text-blue-500';
      case 'pdf':
        return 'bg-red-500/10 text-red-500';
      case 'quiz':
        return 'bg-green-500/10 text-green-500';
      case 'slide':
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'secondary';
      case 'intermediate':
        return 'default';
      case 'advanced':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link materi berhasil disalin!");
  };

  const handleDownload = () => {
    toast.success("Materi sedang diunduh...");
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/konten")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Detail Materi
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container px-6 py-8 max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            {/* Content Header */}
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getTypeColor(content.type)}`}>
                          {getTypeIcon(content.type)}
                        </div>
                        <Badge variant={getDifficultyColor(content.difficulty)} className="capitalize">
                          {content.difficulty === 'beginner' ? 'Pemula' : 
                           content.difficulty === 'intermediate' ? 'Menengah' : 'Lanjutan'}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {content.topic}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-3xl">{content.title}</CardTitle>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{content.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{content.durationMinutes} menit</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Diperbarui {new Date(content.updatedAt).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {content.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="capitalize">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleDownload}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Content Tabs */}
            <motion.div variants={fadeInUp}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Deskripsi Materi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Materi pembelajaran {content.topic} dengan tingkat kesulitan {content.difficulty}. 
                        Dirancang untuk membantu siswa memahami konsep dasar hingga aplikasi praktis.
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">Tujuan Pembelajaran:</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Memahami konsep dasar {content.topic}</li>
                          <li>Menyelesaikan soal dengan berbagai tingkat kesulitan</li>
                          <li>Mengaplikasikan pengetahuan dalam konteks nyata</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold">Prasyarat:</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Pengetahuan matematika dasar</li>
                          <li>Telah menyelesaikan materi sebelumnya (jika ada)</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Informasi File</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Tipe Konten</p>
                          <p className="font-medium capitalize">{content.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Durasi</p>
                          <p className="font-medium">{content.durationMinutes} menit</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ukuran File</p>
                          <p className="font-medium">
                            {content.type === 'video' ? '45 MB' : 
                             content.type === 'pdf' ? '2.3 MB' : 
                             content.type === 'slide' ? '8.5 MB' : '1.2 MB'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Format</p>
                          <p className="font-medium uppercase">
                            {content.type === 'video' ? 'MP4' : 
                             content.type === 'pdf' ? 'PDF' : 
                             content.type === 'slide' ? 'PPTX' : 'JSON'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preview Konten</CardTitle>
                      <CardDescription>Pratinjau materi sebelum dibagikan ke siswa</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        {content.type === 'video' ? (
                          <div className="text-center space-y-4">
                            <Video className="h-16 w-16 mx-auto text-muted-foreground" />
                            <div>
                              <p className="font-medium">Video Preview</p>
                              <p className="text-sm text-muted-foreground">Klik untuk memutar video</p>
                            </div>
                            <Button>
                              <Play className="h-4 w-4 mr-2" />
                              Putar Video
                            </Button>
                          </div>
                        ) : content.type === 'pdf' ? (
                          <div className="text-center space-y-4">
                            <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                            <div>
                              <p className="font-medium">PDF Document</p>
                              <p className="text-sm text-muted-foreground">Lihat preview dokumen</p>
                            </div>
                            <Button>
                              <FileText className="h-4 w-4 mr-2" />
                              Buka PDF
                            </Button>
                          </div>
                        ) : content.type === 'slide' ? (
                          <div className="text-center space-y-4">
                            <Presentation className="h-16 w-16 mx-auto text-muted-foreground" />
                            <div>
                              <p className="font-medium">Presentation Slides</p>
                              <p className="text-sm text-muted-foreground">Preview slide presentasi</p>
                            </div>
                            <Button>
                              <Presentation className="h-4 w-4 mr-2" />
                              Lihat Slides
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center space-y-4">
                            <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground" />
                            <div>
                              <p className="font-medium">Quiz Interaktif</p>
                              <p className="text-sm text-muted-foreground">Preview soal quiz</p>
                            </div>
                            <Button>
                              <Play className="h-4 w-4 mr-2" />
                              Mulai Quiz
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">245</p>
                        <p className="text-xs text-muted-foreground mt-1">+12% dari minggu lalu</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">78%</p>
                        <p className="text-xs text-muted-foreground mt-1">189 dari 245 siswa</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">82</p>
                        <p className="text-xs text-muted-foreground mt-1">Dari 100 siswa yang mengerjakan</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Engagement Timeline</CardTitle>
                      <CardDescription>Aktivitas siswa terhadap materi ini</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { date: '7 Nov 2025', activity: '12 siswa menonton video', type: 'view' },
                          { date: '6 Nov 2025', activity: '8 siswa menyelesaikan materi', type: 'complete' },
                          { date: '5 Nov 2025', activity: '15 siswa mengunduh PDF', type: 'download' },
                          { date: '4 Nov 2025', activity: '20 siswa membuka materi', type: 'view' },
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                            <div className={`p-2 rounded-lg ${
                              item.type === 'view' ? 'bg-blue-500/10' :
                              item.type === 'complete' ? 'bg-green-500/10' :
                              'bg-purple-500/10'
                            }`}>
                              {item.type === 'view' ? <Play className="h-4 w-4 text-blue-500" /> :
                               item.type === 'complete' ? <BookOpen className="h-4 w-4 text-green-500" /> :
                               <Download className="h-4 w-4 text-purple-500" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.activity}</p>
                              <p className="text-xs text-muted-foreground">{item.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default ContentDetail;
