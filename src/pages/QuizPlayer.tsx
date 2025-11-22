import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { QuizCard } from "@/components/QuizCard";
import { CircularMastery } from "@/components/CircularMastery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, Timer, Trophy, Star, Zap, Clock, Target, Award, Brain, Heart } from "lucide-react";
import { QuizFeedback } from "@/components/QuizFeedback";
import { mockTopics, QuizQuestion } from "@/data/mockData";
import { generateDailyQuiz, saveQuizToHistory } from "@/lib/quizGenerator";
import { toast } from "sonner";
import { 
  fadeIn, 
  fadeInUp, 
  scaleIn, 
  slideInFromLeft, 
  slideInFromRight,
  staggerContainer,
  hoverLift
} from "@/lib/animations";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const QuizPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if this is a heart refill quiz
  const searchParams = new URLSearchParams(location.search);
  const isHeartRefill = searchParams.get('refill') === 'true';
  const moduleId = searchParams.get('moduleId');
  const topicId = searchParams.get('topic') || location.state?.topicId || 'algebra';
  const subjectInfo = location.state?.subjectInfo;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { answer: string | string[], correct: boolean }>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Generate fresh quiz on mount (5 questions for heart refill, 10 for normal)
  useEffect(() => {
    const questionCount = isHeartRefill ? 5 : 10;
    const generatedQuiz = generateDailyQuiz(topicId, questionCount);
    if (generatedQuiz.length === 0) {
      toast.error("Tidak ada soal tersedia untuk kategori ini");
      navigate('/bank-soal');
      return;
    }
    setQuestions(generatedQuiz);
  }, [topicId, navigate, isHeartRefill]);

  const currentQuestion = questions[currentQuestionIndex];
  const topic = mockTopics.find(t => t.id === topicId);
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  useEffect(() => {
    if (!quizCompleted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      // Save quiz to history when completed
      const questionIds = questions.map(q => q.id);
      saveQuizToHistory(topicId, questionIds);
    }
  }, [quizCompleted, topicId, questions]);

  const handleSubmitAnswer = (answer: string | string[], isCorrect: boolean) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: { answer, correct: isCorrect }
    });

    if (isCorrect) {
      toast.success("Benar! Lanjut ke soal berikutnya");
    } else {
      toast.error("Coba lagi di sesi berikutnya");
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setQuizCompleted(true);
      }
    }, 2000);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    const correctAnswers = Object.values(answers).filter(a => a.correct).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizCompleted) {
    const score = calculateScore();
    const correctAnswers = Object.values(answers).filter(a => a.correct).length;
    const isPerfect = score === 100;
    const isGood = score >= 70;
    const passedHeartRefill = isHeartRefill && score >= 50; // 50% untuk refill hearts
    
    // Handle heart refill
    useEffect(() => {
      if (isHeartRefill && passedHeartRefill) {
        // Refill hearts to max
        localStorage.setItem('userHearts', '5');
        localStorage.removeItem('heartRefillTime');
        toast.success('Hearts berhasil diisi ulang! ❤️❤️❤️❤️❤️', {
          description: 'Kamu bisa melanjutkan belajar sekarang!'
        });
      } else if (isHeartRefill && !passedHeartRefill) {
        toast.error('Belum mencapai 50% jawaban benar', {
          description: 'Coba lagi atau tunggu timer untuk refill otomatis'
        });
      }
    }, [isHeartRefill, passedHeartRefill]);
    
    return (
      <SidebarProvider>
        <div className="min-h-screen w-full flex bg-gradient-to-br from-background via-background to-primary/5">
          <AppSidebar role="student" />
          <div className="flex-1 relative overflow-hidden">
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
                    className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Trophy className="w-5 h-5 text-white" />
                  </motion.div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    {isHeartRefill ? 'Heart Refill Quiz!' : 'Quiz Selesai!'}
                  </h1>
                </div>
              </div>
            </motion.header>
            
            {/* Confetti for good scores */}
            {isGood && (
              <Confetti
                width={typeof window !== 'undefined' ? window.innerWidth : 300}
                height={typeof window !== 'undefined' ? window.innerHeight : 200}
                numberOfPieces={isPerfect ? 500 : 200}
                recycle={false}
                gravity={0.3}
              />
            )}

            <div className="container px-4 py-12 max-w-3xl mx-auto">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <Card className="relative overflow-hidden border-2 shadow-2xl">
                  {/* Gradient overlay for perfect score */}
                  {isPerfect && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-600/10 pointer-events-none"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  )}
                  
                  <CardContent className="pt-12 pb-8 text-center space-y-6 relative">
                    {/* Animated trophy icon */}
                    <motion.div
                      variants={scaleIn}
                      className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 mb-4 relative"
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, -10, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="relative"
                      >
                        {isPerfect ? (
                          <Trophy className="w-16 h-16 text-green-500" />
                        ) : isGood ? (
                          <Award className="w-16 h-16 text-green-500" />
                        ) : (
                          <CheckCircle className="w-16 h-16 text-primary" />
                        )}
                      </motion.div>
                      
                      {/* Floating stars for perfect score */}
                      {isPerfect && (
                        <>
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute"
                          animate={{
                            y: [-20, -40, -20],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeInOut"
                          }}
                          style={{
                            left: `${30 + i * 30}%`,
                            top: '-10px'
                          }}
                        >
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        </motion.div>
                      ))}
                    </>
                  )}
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {isPerfect ? 'Sempurna! 🏆' : isGood ? 'Quiz Selesai! 🎉' : 'Quiz Selesai'}
                  </h1>
                  <p className="text-lg text-muted-foreground mt-2">
                    {isPerfect 
                      ? 'Luar biasa! Semua jawaban benar!' 
                      : isGood 
                      ? `Bagus! Kamu berhasil menyelesaikan quiz` 
                      : 'Terus berlatih untuk meningkatkan skor'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Topik: <strong>{topic?.title}</strong>
                  </p>
                </motion.div>

                <motion.div variants={scaleIn} className="py-8">
                  <CircularMastery 
                    percent={score} 
                    label="Skor Kamu"
                    size="lg"
                  />
                </motion.div>

                <motion.div 
                  variants={fadeInUp}
                  className="grid grid-cols-2 gap-4 max-w-md mx-auto"
                >
                  <motion.div 
                    variants={hoverLift}
                    whileHover="hover"
                    className="p-4 bg-muted/50 rounded-lg"
                  >
                    <Timer className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Waktu</p>
                    <p className="text-2xl font-bold font-mono">{formatTime(timeElapsed)}</p>
                  </motion.div>
                  <motion.div 
                    variants={hoverLift}
                    whileHover="hover"
                    className="p-4 bg-muted/50 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-accent mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Benar</p>
                    <p className="text-2xl font-bold text-accent">
                      <AnimatedCounter value={correctAnswers} />/{questions.length}
                    </p>
                  </motion.div>
                </motion.div>

                {/* XP Earned */}
                <motion.div 
                  variants={scaleIn}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full"
                >
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-semibold">
                    +<AnimatedCounter value={correctAnswers * 10} /> XP Earned
                  </span>
                </motion.div>

                {/* Heart Refill Success Message */}
                {isHeartRefill && passedHeartRefill && (
                  <motion.div
                    variants={scaleIn}
                    className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-2 border-red-500 rounded-lg"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ❤️❤️❤️❤️❤️
                      </motion.div>
                    </div>
                    <h3 className="font-bold text-red-600 text-lg">Hearts Terisi Penuh!</h3>
                    <p className="text-sm text-muted-foreground">
                      Kamu berhasil menjawab {correctAnswers}/{questions.length} soal dengan benar. Hearts kamu sekarang penuh!
                    </p>
                  </motion.div>
                )}

                {/* Heart Refill Failed Message */}
                {isHeartRefill && !passedHeartRefill && (
                  <motion.div
                    variants={scaleIn}
                    className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border-2 border-gray-500 rounded-lg"
                  >
                    <h3 className="font-bold text-gray-600 text-lg">Belum Berhasil Refill</h3>
                    <p className="text-sm text-muted-foreground">
                      Kamu perlu menjawab minimal {Math.ceil(questions.length / 2)} dari {questions.length} soal dengan benar. Coba lagi!
                    </p>
                  </motion.div>
                )}

                {/* AI Quiz Feedback - Optional */}
                {!isHeartRefill && currentQuestion && (
                  <motion.div variants={fadeInUp} className="w-full max-w-2xl mx-auto">
                    <QuizFeedback
                      questionId={currentQuestion.id}
                      correctAnswer={currentQuestion.correctAnswer}
                      rubric={currentQuestion.explanation}
                    />
                  </motion.div>
                )}

                <motion.div 
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-3 pt-6"
                >
                  {isHeartRefill ? (
                    <>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate('/belajar')}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Pembelajaran
                      </Button>
                      {passedHeartRefill ? (
                        <Button 
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                          onClick={() => navigate(`/lesson/${moduleId}`)}
                        >
                          Lanjut Belajar
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button 
                          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                          onClick={() => {
                            const newQuiz = generateDailyQuiz(topicId, 5);
                            setQuestions(newQuiz);
                            setCurrentQuestionIndex(0);
                            setAnswers({});
                            setTimeElapsed(0);
                            setQuizCompleted(false);
                          }}
                        >
                          Coba Lagi Quiz
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate('/dashboard-siswa')}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Dashboard
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        onClick={() => {
                          const newQuiz = generateDailyQuiz(topicId, 10);
                          setQuestions(newQuiz);
                          setCurrentQuestionIndex(0);
                          setAnswers({});
                          setTimeElapsed(0);
                          setQuizCompleted(false);
                        }}
                      >
                        Coba Lagi
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // Loading state while questions are being generated
  if (questions.length === 0) {
    return (
      <SidebarProvider>
        <div className="min-h-screen w-full flex bg-gradient-to-br from-background via-background to-primary/5">
          <AppSidebar role="student" />
          <div className="flex-1 flex items-center justify-center">
            <Card className="p-8 text-center max-w-md">
              <CardContent className="space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-16 h-16 mx-auto text-primary" />
                </motion.div>
                <h2 className="text-2xl font-bold">Mempersiapkan Quiz...</h2>
                <p className="text-muted-foreground">
                  Sedang mengacak soal-soal untuk quiz Anda
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarProvider>
    );
  }

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
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <motion.div
                  className={`p-2 rounded-lg ${
                    isHeartRefill 
                      ? 'bg-gradient-to-br from-red-500 to-pink-600'
                      : 'bg-gradient-to-br from-primary to-purple-600'
                  }`}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                >
                  {isHeartRefill ? (
                    <Heart className="w-5 h-5 text-white" />
                  ) : (
                    <Brain className="w-5 h-5 text-white" />
                  )}
                </motion.div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {topic?.title}
                  </h1>
                  {isHeartRefill && (
                    <p className="text-xs text-red-600 font-semibold">
                      ❤️ Heart Refill Quiz - Minimal 50% benar
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.header>
      
          <div className="container px-4 py-8 max-w-4xl mx-auto">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              {/* Progress Bar */}
              <motion.div variants={fadeInUp} className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-bold">
                      Soal <AnimatedCounter value={currentQuestionIndex + 1} /> dari {questions.length}
                    </h2>
                    <p className="text-sm text-muted-foreground">{topic?.title}</p>
                  </div>
                  
                  {/* Timer Display */}
                  <motion.div
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border-2 border-primary/20"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-mono font-bold text-lg">{formatTime(timeElapsed)}</span>
                  </motion.div>
                </div>
                
                {/* Enhanced Progress Bar */}
                <div className="relative">
                  <Progress value={progress} className="h-3" />
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/50 via-purple-500/50 to-pink-500/50 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ filter: "blur(6px)", opacity: 0.6 }}
                  />
                  <motion.div
                    className="absolute -top-1 bg-primary rounded-full w-5 h-5 border-4 border-background shadow-lg"
                    style={{ left: `calc(${progress}% - 10px)` }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  {Math.round(progress)}% selesai
                </p>
              </motion.div>

              {/* Quiz Question with slide transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="mb-6"
                >
                  <QuizCard
                    question={currentQuestion}
                    onSubmit={handleSubmitAnswer}
                    showFeedback={true}
                    subjectInfo={subjectInfo}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Question Navigator */}
              <motion.div 
                variants={fadeInUp}
                className="grid grid-cols-10 gap-2 mb-6"
              >
                {questions.map((_, index) => {
                  const isActive = index === currentQuestionIndex;
                  const isAnswered = answers[index] !== undefined;
                  const isCorrect = answers[index]?.correct;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`aspect-square rounded-lg text-sm font-semibold relative transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : isAnswered
                          ? isCorrect
                            ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                            : 'bg-red-500/20 text-red-600 dark:text-red-400'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      animate={{
                        scale: isActive ? 1.15 : 1,
                        boxShadow: isActive 
                          ? '0 0 20px rgba(139, 92, 246, 0.6)' 
                          : '0 0 0px rgba(0, 0, 0, 0)'
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      {isAnswered && isCorrect && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute -top-1 -right-1"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 fill-background" />
                        </motion.div>
                      )}
                      {index + 1}
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Navigation Buttons */}
              <motion.div 
                variants={fadeInUp}
                className="flex justify-between items-center gap-4"
              >
                <motion.div whileHover="hover" whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Sebelumnya
                  </Button>
                </motion.div>

                <motion.div whileHover="hover" whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Selanjutnya
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      </SidebarProvider>
    );
};

export default QuizPlayer;
