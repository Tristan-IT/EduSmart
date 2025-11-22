import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { 
  ClipboardList, 
  Calculator, 
  Shapes, 
  TrendingUp, 
  PieChart,
  Triangle,
  Brain,
  Play,
  CheckCircle2,
  Clock,
  Star,
  GraduationCap
} from "lucide-react";
import { 
  fadeInUp, 
  scaleIn, 
  staggerContainer 
} from "@/lib/animations";
import { subjectApi } from "@/lib/apiClient";

interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: typeof Calculator;
  totalQuestions: number;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  estimatedTime: number; // in minutes
  color: string;
  gradient: string;
  completed?: number; // completed quizzes count
}

interface Subject {
  _id: string;
  code: string;
  name: string;
  category: string;
  color: string;
}

const QuizCategories = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const response = await subjectApi.getAll();
      if (response.success) {
        setSubjects(response.subjects);
      }
    } catch (error) {
      console.error("Failed to load subjects:", error);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const categories: QuizCategory[] = [
    {
      id: 'algebra',
      title: 'Aljabar',
      description: 'Persamaan, pertidaksamaan, fungsi, dan operasi aljabar',
      icon: Calculator,
      totalQuestions: 50,
      difficulty: 'Sedang',
      estimatedTime: 15,
      color: 'text-blue-500',
      gradient: 'from-blue-500 to-cyan-600',
      completed: 12
    },
    {
      id: 'geometry',
      title: 'Geometri',
      description: 'Bangun datar, bangun ruang, transformasi geometri',
      icon: Shapes,
      totalQuestions: 45,
      difficulty: 'Sedang',
      estimatedTime: 20,
      color: 'text-green-500',
      gradient: 'from-green-500 to-emerald-600',
      completed: 8
    },
    {
      id: 'calculus',
      title: 'Kalkulus',
      description: 'Limit, turunan, integral, dan aplikasinya',
      icon: TrendingUp,
      totalQuestions: 40,
      difficulty: 'Sulit',
      estimatedTime: 25,
      color: 'text-purple-500',
      gradient: 'from-purple-500 to-pink-600',
      completed: 5
    },
    {
      id: 'statistics',
      title: 'Statistika',
      description: 'Peluang, data, diagram, dan analisis statistik',
      icon: PieChart,
      totalQuestions: 35,
      difficulty: 'Mudah',
      estimatedTime: 15,
      color: 'text-orange-500',
      gradient: 'from-orange-500 to-red-600',
      completed: 15
    },
    {
      id: 'trigonometry',
      title: 'Trigonometri',
      description: 'Fungsi trigonometri, identitas, dan aplikasinya',
      icon: Triangle,
      totalQuestions: 38,
      difficulty: 'Sedang',
      estimatedTime: 18,
      color: 'text-pink-500',
      gradient: 'from-pink-500 to-rose-600',
      completed: 6
    },
    {
      id: 'logic',
      title: 'Logika Matematika',
      description: 'Logika, himpunan, dan penalaran matematika',
      icon: Brain,
      totalQuestions: 30,
      difficulty: 'Mudah',
      estimatedTime: 12,
      color: 'text-indigo-500',
      gradient: 'from-indigo-500 to-purple-600',
      completed: 10
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'Sedang': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'Sulit': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleStartQuiz = (categoryId: string) => {
    const subjectData = subjects.find(s => s._id === selectedSubject);
    navigate('/quiz-player', { 
      state: { 
        topicId: categoryId,
        subjectInfo: subjectData ? {
          name: subjectData.name,
          color: subjectData.color,
          code: subjectData.code
        } : undefined
      } 
    });
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
            <div className="flex h-full items-center px-4 gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-lg bg-gradient-to-br from-primary to-purple-600"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <ClipboardList className="w-5 h-5 text-white" />
                </motion.div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Bank Soal
                </h1>
              </div>
            </div>
          </motion.header>

          <div className="container px-4 py-8 max-w-6xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Header Section */}
              <motion.div variants={fadeInUp} className="mb-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Pilih Kategori Quiz
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Latih kemampuanmu dengan berbagai kategori soal matematika. 
                    Setiap kategori memiliki ratusan soal yang akan di-random setiap hari!
                  </p>
                </div>

                {/* Subject Filter */}
                <div className="flex justify-center mb-6">
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-64">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Pilih mata pelajaran" />
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
                </div>
              </motion.div>

              {/* Stats Overview */}
              <motion.div 
                variants={fadeInUp}
                className="grid md:grid-cols-3 gap-4 mb-8"
              >
                <Card className="border-2">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-muted-foreground">Total Quiz Dikerjakan</span>
                    </div>
                    <p className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                      56
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-muted-foreground">Rata-rata Skor</span>
                    </div>
                    <p className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      85%
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted-foreground">Total Waktu Belajar</span>
                    </div>
                    <p className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                      14h
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Categories Grid */}
              <motion.div
                variants={staggerContainer}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  
                  return (
                    <motion.div
                      key={category.id}
                      variants={scaleIn}
                      custom={index}
                    >
                      <Card 
                        className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 group h-full"
                      >
                        {/* Gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                        
                        {/* Animated background blob */}
                        <motion.div
                          className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${category.gradient} rounded-full blur-3xl opacity-20`}
                          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />

                        <CardHeader className="relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <motion.div
                              className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient}`}
                              whileHover={{ scale: 1.1, rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </motion.div>
                            
                            <Badge className={getDifficultyColor(category.difficulty)}>
                              {category.difficulty}
                            </Badge>
                          </div>

                          <CardTitle className="text-xl mb-2">
                            {category.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.description}
                          </p>
                        </CardHeader>

                        <CardContent className="relative z-10 space-y-4">
                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {category.totalQuestions} Soal
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                ~{category.estimatedTime} menit
                              </span>
                            </div>
                          </div>

                          {/* Progress */}
                          {category.completed && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className={`font-semibold ${category.color}`}>
                                  {category.completed} quiz selesai
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full bg-gradient-to-r ${category.gradient}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(category.completed / 20) * 100}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                />
                              </div>
                            </div>
                          )}

                          {/* CTA Button */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              className={`w-full bg-gradient-to-r ${category.gradient} hover:opacity-90 transition-opacity`}
                              onClick={() => handleStartQuiz(category.id)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Mulai Quiz
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Info Section */}
              <motion.div variants={fadeInUp} className="mt-8">
                <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Brain className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          💡 Tips Mengerjakan Quiz
                        </h3>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Soal akan di-random dari bank soal setiap kali kamu mulai quiz baru</li>
                          <li>• Kerjakan dengan tenang dan teliti, tidak ada batasan waktu</li>
                          <li>• Kamu bisa mengulang quiz berkali-kali untuk meningkatkan skor</li>
                          <li>• Setiap jawaban benar akan memberikan XP untuk naik level!</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default QuizCategories;
