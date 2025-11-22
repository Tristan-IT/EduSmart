import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Video,
  FileText,
  Download,
  CheckCircle,
  ArrowRight,
  Clock,
  Target,
  Lightbulb,
  Code,
  Play,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/apiClient";
import { AlertMessage } from "@/components/AlertMessage";

interface LessonContent {
  type: "text" | "video" | "interactive" | "mixed";
  textContent?: string;
  videoUrl?: string;
  videoDuration?: number;
  attachments?: Array<{
    type: "pdf" | "image" | "document";
    url: string;
    name: string;
    size?: number;
  }>;
  interactiveElements?: Array<{
    type: "simulation" | "animation" | "tool";
    url: string;
    description: string;
  }>;
  learningObjectives?: string[];
  keyPoints?: string[];
  examples?: Array<{
    title: string;
    description: string;
    code?: string;
  }>;
  estimatedMinutes: number;
}

interface Lesson {
  nodeId: string;
  title: string;
  description: string;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  estimatedDuration: string;
  content: LessonContent;
  learningOutcomes?: string[];
  kompetensiDasar?: string;
}

export default function LessonViewer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  // Get nodeId from location state or query params
  const nodeId = (location.state as any)?.nodeId || new URLSearchParams(location.search).get("nodeId");

  useEffect(() => {
    if (nodeId) {
      fetchLesson();
    } else {
      setError("Node ID tidak ditemukan");
      setLoading(false);
    }
  }, [nodeId]);

  useEffect(() => {
    // Track scroll progress
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(scrollPercentage, 100));

      // Auto-mark as completed when scrolled 80%
      if (scrollPercentage > 80 && !lessonCompleted) {
        setLessonCompleted(true);
        markAsViewed();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lessonCompleted]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/lessons/${nodeId}`);
      // @ts-ignore - API response type
      setLesson(response.lesson);
    } catch (err: any) {
      console.error("Error fetching lesson:", err);
      setError(err.message || "Gagal memuat konten pembelajaran");
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = async () => {
    try {
      await apiClient.post(`/api/lessons/${nodeId}/view`);
      setProgress(100);
    } catch (err) {
      console.error("Error marking lesson as viewed:", err);
    }
  };

  const handleStartQuiz = () => {
    if (!nodeId) return;
    navigate("/quiz-player", { state: { nodeId } });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Mudah":
        return "bg-green-100 text-green-800 border-green-200";
      case "Sedang":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Sulit":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat pembelajaran...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <AlertMessage type="danger" message={error || "Konten tidak ditemukan"} />
            <Button onClick={() => navigate(-1)} className="w-full mt-4">
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <Progress value={scrollProgress} className="h-1 rounded-none" />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getDifficultyColor(lesson.difficulty)}>
                {lesson.difficulty}
              </Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                <Clock className="w-3 h-3 mr-1" />
                {lesson.content.estimatedMinutes} menit
              </Badge>
              {lesson.kompetensiDasar && (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  KD: {lesson.kompetensiDasar}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-4">{lesson.title}</h1>
            <p className="text-white/90 text-lg">{lesson.description}</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Learning Objectives */}
          {lesson.learningOutcomes && lesson.learningOutcomes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Tujuan Pembelajaran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {lesson.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2">
              <Tabs defaultValue="content" className="w-full">
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Materi
                    </TabsTrigger>
                    <TabsTrigger value="examples">
                      <Code className="w-4 h-4 mr-2" />
                      Contoh
                    </TabsTrigger>
                    <TabsTrigger value="resources">
                      <FileText className="w-4 h-4 mr-2" />
                      Sumber
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent>
                  {/* Main Content */}
                  <TabsContent value="content" className="space-y-6">
                    {/* Video Content */}
                    {(lesson.content.type === "video" || lesson.content.type === "mixed") &&
                      lesson.content.videoUrl && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Video className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Video Pembelajaran</h3>
                            {lesson.content.videoDuration && (
                              <Badge variant="outline">
                                <Clock className="w-3 h-3 mr-1" />
                                {lesson.content.videoDuration} menit
                              </Badge>
                            )}
                          </div>
                          <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            {lesson.content.videoUrl.includes("youtube.com") ||
                            lesson.content.videoUrl.includes("youtu.be") ? (
                              <iframe
                                src={lesson.content.videoUrl.replace("watch?v=", "embed/")}
                                className="w-full h-full"
                                allowFullScreen
                              />
                            ) : (
                              <video src={lesson.content.videoUrl} controls className="w-full h-full" />
                            )}
                          </div>
                        </div>
                      )}

                    {/* Text Content */}
                    {(lesson.content.type === "text" || lesson.content.type === "mixed") &&
                      lesson.content.textContent && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Penjelasan Materi</h3>
                          </div>
                          <div
                            className="prose prose-blue max-w-none"
                            dangerouslySetInnerHTML={{ __html: lesson.content.textContent }}
                          />
                        </div>
                      )}

                    {/* Key Points */}
                    {lesson.content.keyPoints && lesson.content.keyPoints.length > 0 && (
                      <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-900">Poin Penting</h3>
                        </div>
                        <ul className="space-y-2">
                          {lesson.content.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2 text-blue-800">
                              <span className="font-bold">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Interactive Elements */}
                    {lesson.content.interactiveElements &&
                      lesson.content.interactiveElements.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Play className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Elemen Interaktif</h3>
                          </div>
                          <div className="grid gap-3">
                            {lesson.content.interactiveElements.map((element, index) => (
                              <Card key={index} className="border-2 hover:border-primary transition-colors">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <Badge variant="outline" className="mb-2">
                                        {element.type}
                                      </Badge>
                                      <p className="text-sm text-muted-foreground">
                                        {element.description}
                                      </p>
                                    </div>
                                    <Button asChild size="sm">
                                      <a
                                        href={element.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Buka
                                        <ExternalLink className="w-4 h-4 ml-2" />
                                      </a>
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                  </TabsContent>

                  {/* Examples */}
                  <TabsContent value="examples" className="space-y-4">
                    {lesson.content.examples && lesson.content.examples.length > 0 ? (
                      lesson.content.examples.map((example, index) => (
                        <Card key={index} className="border-2">
                          <CardHeader>
                            <CardTitle className="text-lg">{example.title}</CardTitle>
                            <CardDescription>{example.description}</CardDescription>
                          </CardHeader>
                          {example.code && (
                            <CardContent>
                              <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto">
                                <code>{example.code}</code>
                              </pre>
                            </CardContent>
                          )}
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Belum ada contoh untuk materi ini</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Resources */}
                  <TabsContent value="resources" className="space-y-4">
                    {lesson.content.attachments && lesson.content.attachments.length > 0 ? (
                      <div className="grid gap-3">
                        {lesson.content.attachments.map((attachment, index) => (
                          <Card key={index} className="border-2 hover:border-primary transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{attachment.name}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Badge variant="outline" className="text-xs">
                                        {attachment.type.toUpperCase()}
                                      </Badge>
                                      {attachment.size && (
                                        <span>{(attachment.size / 1024).toFixed(1)} KB</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Button asChild size="sm" variant="outline">
                                  <a href={attachment.url} download>
                                    <Download className="w-4 h-4 mr-2" />
                                    Unduh
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Belum ada sumber tambahan</p>
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Completion Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Sudah Paham Materinya?</h3>
                    <p className="text-muted-foreground">
                      Lanjutkan dengan mengerjakan kuis untuk mendapatkan XP!
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleStartQuiz}
                    className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                  >
                    Mulai Kuis
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
