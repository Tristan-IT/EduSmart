import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  BookOpen, 
  Video, 
  PenTool, 
  CheckCircle, 
  Circle,
  Award,
  Clock,
  Target,
  Lightbulb,
  Play,
  RefreshCw,
  Heart,
  X
} from "lucide-react";
import { fadeIn, fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import { getModuleById, type LearningModule } from "@/data/learningModules";
import { toast } from "sonner";
import { getRandomExercise, convertToModuleExercise } from "@/lib/exerciseGenerator";

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("teori");
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});
  const [submittedExercises, setSubmittedExercises] = useState<Record<string, boolean>>({});
  const [usedExerciseIds, setUsedExerciseIds] = useState<string[]>([]);
  
  // Hearts system
  const [hearts, setHearts] = useState(() => {
    const saved = localStorage.getItem('userHearts');
    return saved ? parseInt(saved) : 5;
  });
  const maxHearts = 5;
  const [lostHeartId, setLostHeartId] = useState<number | null>(null);
  
  // Heart refill timer (20 minutes)
  const [nextRefillTime, setNextRefillTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('heartRefillTime');
    return saved ? parseInt(saved) : null;
  });
  const [timeUntilRefill, setTimeUntilRefill] = useState<string>('');

  // Update refill timer
  useEffect(() => {
    if (!nextRefillTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = nextRefillTime - now;

      if (diff <= 0) {
        // Time's up - refill hearts
        setHearts(maxHearts);
        setNextRefillTime(null);
        localStorage.removeItem('heartRefillTime');
        toast.success('Hearts telah terisi penuh! ❤️');
      } else {
        // Format time remaining
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeUntilRefill(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextRefillTime]);

  // Save hearts to localStorage
  useEffect(() => {
    localStorage.setItem('userHearts', hearts.toString());
  }, [hearts]);

  // Fetch lesson data based on lessonId
  const lesson = getModuleById(lessonId || "");
  
  // State for exercises (allow dynamic updates)
  const [exercises, setExercises] = useState(lesson?.exercises || []);
  
  // Initialize exercises and used exercise IDs when lesson loads
  useEffect(() => {
    if (lesson) {
      setExercises(lesson.exercises);
      setUsedExerciseIds(lesson.exercises.map(ex => ex.id));
    }
  }, [lesson?.id]);
  
  // Handle lesson not found
  if (!lesson) {
    return (
      <SidebarProvider>
        <div className="min-h-screen w-full flex bg-gradient-to-br from-background via-background to-primary/5">
          <AppSidebar role="student" />
          <div className="flex-1 flex items-center justify-center">
            <Card className="p-8 text-center max-w-md">
              <CardContent className="space-y-4">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground" />
                <h2 className="text-2xl font-bold">Modul Tidak Ditemukan</h2>
                <p className="text-muted-foreground">
                  Maaf, modul pembelajaran yang Anda cari tidak tersedia.
                </p>
                <Button onClick={() => navigate('/belajar')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Pembelajaran
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const completedExercises = Object.values(submittedExercises).filter(Boolean).length;
  const progressPercentage = exercises.length > 0 
    ? (completedExercises / exercises.length) * 100 
    : 0;
  
  const isAllExercisesCompleted = progressPercentage === 100;

  const handleCompleteModule = () => {
    // Calculate score (0-100) based on correct answers
    const totalExercises = exercises.length;
    const correctAnswers = Object.values(submittedExercises).filter(Boolean).length;
    const score = totalExercises > 0 ? Math.round((correctAnswers / totalExercises) * 100) : 0;

    // Save completion data to localStorage
    localStorage.setItem('lastCompletedNode', lessonId || '');
    localStorage.setItem('lastCompletedScore', score.toString());
    
    // Show success toast
    toast.success(`Modul selesai! Score: ${score}/100`, {
      description: "Kembali ke halaman pembelajaran untuk melanjutkan"
    });

    // Redirect to learning page after short delay
    setTimeout(() => {
      navigate('/belajar');
    }, 1500);
  };

  const handleExerciseSubmit = (exerciseId: string, answer: string | string[], correctAnswer: string | string[]) => {
    const isCorrect = Array.isArray(answer) && Array.isArray(correctAnswer)
      ? JSON.stringify(answer.sort()) === JSON.stringify(correctAnswer.sort())
      : answer === correctAnswer;
    
    setSubmittedExercises({
      ...submittedExercises,
      [exerciseId]: isCorrect
    });

    if (isCorrect) {
      toast.success("Jawaban Benar! 🎉");
    } else {
      // Wrong answer - lose a heart
      if (hearts > 0) {
        setLostHeartId(hearts - 1); // Trigger animation on this heart
        setTimeout(() => {
          setHearts(prev => Math.max(0, prev - 1));
          setLostHeartId(null);
        }, 500); // Wait for animation
      }
      
      toast.error("Jawaban Salah! -1 ❤️", {
        description: hearts > 1 ? `Sisa ${hearts - 1} hearts` : "Hearts habis!"
      });

      // Check if hearts will be 0
      if (hearts <= 1) {
        // Start 20-minute timer for auto refill
        const refillTime = Date.now() + (20 * 60 * 1000); // 20 minutes
        setNextRefillTime(refillTime);
        localStorage.setItem('heartRefillTime', refillTime.toString());
        
        setTimeout(() => {
          toast.error("Hearts Habis!", {
            description: "Selesaikan quiz atau tunggu 20 menit untuk refill"
          });
        }, 1000);
      }
    }
  };

  const handleRefreshExercise = (currentExerciseId: string, exerciseIndex: number) => {
    if (!lesson) return;

    // Get new random exercise from bank
    const newExercise = getRandomExercise(lessonId || '', usedExerciseIds);
    
    if (!newExercise) {
      toast.error("Tidak ada soal lain tersedia saat ini");
      return;
    }

    // Convert exercise
    const convertedExercise = convertToModuleExercise(newExercise);
    
    // Update exercises array in state
    setExercises(prev => {
      const updated = [...prev];
      updated[exerciseIndex] = convertedExercise;
      return updated;
    });

    // Track used exercise
    setUsedExerciseIds(prev => [...prev, newExercise.id]);

    // Clear submission status for old exercise
    setSubmittedExercises(prev => {
      const updated = { ...prev };
      delete updated[currentExerciseId];
      delete updated[newExercise.id]; // Also clear new exercise ID
      return updated;
    });

    // Clear answers for both old and new exercise
    setExerciseAnswers(prev => {
      const updated = { ...prev };
      delete updated[currentExerciseId];
      delete updated[newExercise.id];
      return updated;
    });

    toast.success("Soal baru dimuat! 📝");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Mudah": return "bg-green-100 text-green-700 border-green-300";
      case "Sedang": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Sulit": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-background via-background to-primary/5">
        <AppSidebar role="student" />
        <div className="flex-1">
          {/* Enhanced Header */}
          <motion.header 
            className="sticky top-0 z-50 h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex h-full items-center px-4 gap-4 justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/belajar')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
                <div className="flex items-center gap-3">
                  <motion.div
                    className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <BookOpen className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-lg font-bold">{lesson.title}</h1>
                    <p className="text-xs text-muted-foreground">{lesson.categoryName}</p>
                  </div>
                </div>
              </div>

              {/* Hearts Display */}
              <div className="flex items-center gap-1">
                <AnimatePresence mode="popLayout">
                  {[...Array(maxHearts)].map((_, i) => {
                    const isLost = i >= hearts;
                    const isBeingLost = i === lostHeartId;
                    
                    return (
                      <motion.div
                        key={i}
                        initial={isBeingLost ? { scale: 1 } : false}
                        animate={
                          isBeingLost
                            ? { 
                                scale: [1, 1.3, 0],
                                rotate: [0, 10, -10, 0],
                                opacity: [1, 1, 0]
                              }
                            : { scale: 1, opacity: 1 }
                        }
                        transition={{ duration: 0.5 }}
                      >
                        <Heart
                          className={`w-5 h-5 transition-all ${
                            isLost 
                              ? 'text-gray-300 dark:text-gray-600' 
                              : 'text-red-500 fill-red-500'
                          }`}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <span className="ml-2 text-sm font-bold text-muted-foreground">
                  {hearts}/{maxHearts}
                </span>
              </div>
            </div>
          </motion.header>

          <div className="container px-4 py-8 max-w-6xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              {/* Lesson Overview Card */}
              <motion.div variants={fadeInUp}>
                <Card className="border-2 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{lesson.title}</CardTitle>
                        <CardDescription className="text-base">
                          {lesson.description}
                        </CardDescription>
                      </div>
                      <Badge className={getDifficultyColor(lesson.difficulty)}>
                        {lesson.difficulty}
                      </Badge>
                    </div>

                    <div className="flex gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{lesson.estimatedDuration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span>{exercises.length} Latihan</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span>{completedExercises}/{exercises.length} Selesai</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Progress Latihan</span>
                        <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>

              {/* Main Content Tabs */}
              <motion.div variants={fadeInUp}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                    <TabsTrigger value="teori" className="flex items-center gap-2 py-3">
                      <BookOpen className="w-4 h-4" />
                      <span className="hidden sm:inline">Teori</span>
                    </TabsTrigger>
                    <TabsTrigger value="video" className="flex items-center gap-2 py-3">
                      <Video className="w-4 h-4" />
                      <span className="hidden sm:inline">Video</span>
                    </TabsTrigger>
                    <TabsTrigger value="latihan" className="flex items-center gap-2 py-3">
                      <PenTool className="w-4 h-4" />
                      <span className="hidden sm:inline">Latihan</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Theory Tab */}
                  <TabsContent value="teori" className="mt-6 space-y-6">
                    {/* Learning Objectives */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          Tujuan Pembelajaran
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {lesson.learningObjectives.map((objective, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Theory Sections */}
                    {lesson.theory.sections.map((section, idx) => (
                      <Card key={idx}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                            {section.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm leading-relaxed whitespace-pre-line">
                            {section.content}
                          </p>
                          {section.keyPoints && section.keyPoints.length > 0 && (
                            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4 text-amber-600" />
                                Poin Penting:
                              </h4>
                              <ul className="space-y-2">
                                {section.keyPoints.map((point, kpIdx) => (
                                  <li key={kpIdx} className="text-sm flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {section.examples && section.examples.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                Contoh:
                              </h4>
                              <ul className="space-y-2">
                                {section.examples.map((example, exIdx) => (
                                  <li key={exIdx} className="text-sm font-mono bg-white dark:bg-gray-900 p-2 rounded whitespace-pre-line">
                                    {example}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  {/* Video Tab */}
                  <TabsContent value="video" className="mt-6">
                    <VideoPlayer
                      title={lesson.video.title}
                      description={`${lesson.video.description} • ${lesson.video.channel}`}
                      youtubeUrl={lesson.video.youtubeUrl}
                      duration={lesson.video.duration}
                      category={lesson.categoryName}
                    />

                    {/* Additional Resources */}
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Play className="w-5 h-5 text-red-500" />
                          Tips Menonton Video
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Siapkan catatan untuk mencatat poin-poin penting</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Pause video jika perlu waktu untuk memahami konsep</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Ulangi bagian yang kurang dipahami</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Coba kerjakan contoh soal sendiri sebelum melihat solusi</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Exercises Tab */}
                  <TabsContent value="latihan" className="mt-6 space-y-4">
                    {/* Hearts Warning */}
                    {hearts === 0 && (
                      <Card className="border-2 border-red-500 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20">
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3">
                              <Heart className="w-10 h-10 text-red-500 flex-shrink-0 mt-1" />
                              <div className="flex-1">
                                <h3 className="font-bold text-xl text-red-600 mb-2">Hearts Habis!</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Kamu kehabisan hearts. Pilih salah satu opsi untuk melanjutkan:
                                </p>
                                
                                {/* Options */}
                                <div className="space-y-3">
                                  {/* Option 1: Quiz */}
                                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-blue-500">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1">
                                        <h4 className="font-bold text-sm text-blue-600 mb-1 flex items-center gap-2">
                                          <Award className="w-4 h-4" />
                                          Selesaikan Quiz Praktik
                                        </h4>
                                        <p className="text-xs text-muted-foreground mb-2">
                                          Jawab minimal 50% benar dari 5 soal tentang <strong>{lesson.title}</strong> untuk refill semua hearts
                                        </p>
                                      </div>
                                      <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex-shrink-0"
                                        onClick={() => navigate(`/quiz?topic=${lesson.categoryId}&refill=true&moduleId=${lessonId}`)}
                                      >
                                        <Award className="w-4 h-4 mr-1" />
                                        Mulai Quiz
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Option 2: Wait Timer */}
                                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-300">
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex-1">
                                        <h4 className="font-bold text-sm text-gray-600 mb-1 flex items-center gap-2">
                                          <Clock className="w-4 h-4" />
                                          Tunggu Auto Refill
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                          Hearts akan terisi otomatis dalam <strong>{timeUntilRefill || '20:00'}</strong>
                                        </p>
                                      </div>
                                      <div className="text-2xl font-bold text-gray-600">
                                        ⏱️
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Low Hearts Warning */}
                    {hearts > 0 && hearts <= 2 && (
                      <Card className="border-2 border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Heart className="w-6 h-6 text-orange-500" />
                              <div>
                                <h4 className="font-bold text-sm text-orange-600">Hearts Menipis!</h4>
                                <p className="text-xs text-muted-foreground">
                                  Sisa {hearts} hearts. Selesaikan quiz untuk refill sebelum habis.
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-orange-500 text-orange-600 hover:bg-orange-50 flex-shrink-0"
                              onClick={() => navigate(`/quiz?topic=${lesson.categoryId}&refill=true&moduleId=${lessonId}`)}
                            >
                              <Award className="w-4 h-4 mr-1" />
                              Quiz
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {exercises.map((exercise, idx) => (
                      <Card key={`${exercise.id}-${idx}`} className="border-2">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <CardTitle className="text-base">
                              Soal {idx + 1}
                            </CardTitle>
                            {submittedExercises[exercise.id] !== undefined && (
                              <Badge variant={submittedExercises[exercise.id] ? "default" : "destructive"}>
                                {submittedExercises[exercise.id] ? "Benar ✓" : "Salah ✗"}
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-base font-medium text-foreground mt-2">
                            {exercise.question}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {exercise.type === "mcq" && exercise.options && (
                            <div className="space-y-2">
                              {exercise.options.map((option, optIdx) => (
                                <Button
                                  key={`${exercise.id}-${optIdx}`}
                                  variant="outline"
                                  className="w-full justify-start text-left h-auto py-3"
                                  onClick={() => {
                                    if (hearts === 0 && submittedExercises[exercise.id] === undefined) {
                                      toast.error("Hearts habis! Tidak bisa menjawab soal");
                                      return;
                                    }
                                    setExerciseAnswers({
                                      ...exerciseAnswers,
                                      [exercise.id]: option
                                    });
                                    handleExerciseSubmit(exercise.id, option, exercise.correctAnswer);
                                  }}
                                  disabled={submittedExercises[exercise.id] !== undefined || hearts === 0}
                                >
                                  <Circle className="w-4 h-4 mr-2 flex-shrink-0" />
                                  {option}
                                </Button>
                              ))}
                            </div>
                          )}

                          {submittedExercises[exercise.id] !== undefined && (
                            <div className="space-y-3">
                              <div className={`p-4 rounded-lg border ${
                                submittedExercises[exercise.id] 
                                  ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                                  : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                              }`}>
                                <h4 className="font-semibold text-sm mb-2">Pembahasan:</h4>
                                <p className="text-sm">{exercise.explanation}</p>
                              </div>

                              {/* Refresh Button for Wrong Answers */}
                              {submittedExercises[exercise.id] === false && hearts > 0 && (
                                <Button
                                  variant="outline"
                                  className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                  onClick={() => handleRefreshExercise(exercise.id, idx)}
                                >
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Coba Soal Lain
                                </Button>
                              )}

                              {/* No hearts message */}
                              {submittedExercises[exercise.id] === false && hearts === 0 && (
                                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                                  <p className="text-sm text-muted-foreground">
                                    ❤️ Hearts habis. Tidak bisa refresh soal.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {/* Complete Module Button */}
                    {isAllExercisesCompleted && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-green-500">
                                  <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg">Semua Latihan Selesai! 🎉</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {completedExercises}/{exercises.length} soal dijawab dengan benar
                                  </p>
                                </div>
                              </div>
                              <Button 
                                size="lg"
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                onClick={handleCompleteModule}
                              >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Selesaikan Modul
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </TabsContent>
                </Tabs>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LessonDetail;
