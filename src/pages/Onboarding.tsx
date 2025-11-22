import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Stepper, StepItem } from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CircularMastery } from "@/components/CircularMastery";
import { mockTopics } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CTA_COPY_VARIANTS } from "@/data/ctaCopy";

interface AssessmentQuestion {
  id: string;
  topicId: string;
  text: string;
  options: string[];
}

const onboardingSteps: StepItem[] = [
  { title: "Profil", description: "Minat & tujuan belajar" },
  { title: "Tes Awal", description: "10 soal adaptif" },
  { title: "Rekomendasi", description: "Jalur & aktivitas" },
];

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "q1",
    topicId: "algebra",
    text: "Jika 3x + 2 = 20, berapa nilai x?",
    options: ["4", "6", "8", "10"],
  },
  {
    id: "q2",
    topicId: "geometry",
    text: "Sebuah segitiga memiliki panjang sisi 3, 4, dan 5. Apa jenis segitiga tersebut?",
    options: ["Sembarang", "Sama Kaki", "Siku-siku", "Sama Sisi"],
  },
  {
    id: "q3",
    topicId: "statistics",
    text: "Mean dari 4, 6, 6, 8, dan 10 adalah?",
    options: ["6", "6.8", "7", "8"],
  },
  {
    id: "q4",
    topicId: "trigonometry",
    text: "Nilai sin 30° adalah?",
    options: ["1/4", "1/2", "√3/2", "1"],
  },
  {
    id: "q5",
    topicId: "algebra",
    text: "Sederhanakan: 5(a + 2) - 3a",
    options: ["2a + 10", "5a + 7", "2a + 5", "8a + 2"],
  },
  {
    id: "q6",
    topicId: "statistics",
    text: "Modus dari 2, 2, 3, 5, 5, 5 adalah?",
    options: ["2", "3", "5", "Tidak ada"],
  },
  {
    id: "q7",
    topicId: "geometry",
    text: "Jumlah sudut dalam segi lima adalah?",
    options: ["360°", "450°", "540°", "720°"],
  },
  {
    id: "q8",
    topicId: "algebra",
    text: "Jika f(x) = 2x + 3, maka f(4) = ?",
    options: ["5", "8", "11", "15"],
  },
  {
    id: "q9",
    topicId: "statistics",
    text: "Median dari 3, 7, 11, 15, 19 adalah?",
    options: ["7", "11", "13", "15"],
  },
  {
    id: "q10",
    topicId: "trigonometry",
    text: "Identitas sin^2 x + cos^2 x = ?",
    options: ["0", "1", "2", "tan x"],
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [interest, setInterest] = useState("Matematika Terapan");
  const [learningGoal, setLearningGoal] = useState("Meningkatkan nilai ujian semester");

  const currentQuestion = assessmentQuestions[activeQuestionIndex];
  const progressValue = ((activeQuestionIndex + (activeStep > 1 ? 1 : 0)) / assessmentQuestions.length) * 100;

  const recommendedTopics = useMemo(() => {
    return mockTopics
      .map((topic) => {
        const mastery = Math.floor(Math.random() * 40) + 50;
        return { ...topic, mastery };
      })
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, 3);
  }, []);

  const handleAnswer = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < assessmentQuestions.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
    } else {
      setActiveStep(2);
    }
  };

  const handleStartAssessment = () => {
    setActiveStep(1);
  };

  const handleCompleteOnboarding = () => {
    navigate("/dashboard-siswa", { state: { welcome: true } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="guest" activeRoute="/onboarding" />

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="space-y-4 text-center">
            <Badge variant="secondary" className="rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wider">
              Onboarding Siswa Baru
            </Badge>
            <h1 className="text-3xl font-bold sm:text-4xl">Kenali Gaya Belajarmu dalam 10 Menit</h1>
            <p className="text-muted-foreground">
              Jawab beberapa pertanyaan singkat untuk mempersonalisasi jalur belajar, tantangan, dan intervensi guru yang kamu butuhkan.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <Stepper steps={onboardingSteps} activeIndex={activeStep} interactive onStepClick={setActiveStep} className="w-full" />

            <div className="mt-8">
              {activeStep === 0 && (
                <Card className="border-muted/70">
                  <CardHeader>
                    <CardTitle>Profil Belajar</CardTitle>
                    <CardDescription>Ceritakan tujuanmu agar rekomendasi lebih tepat sasaran.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="minat">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="minat">Minat Belajar</TabsTrigger>
                        <TabsTrigger value="tujuan">Tujuan Belajar</TabsTrigger>
                      </TabsList>
                      <TabsContent value="minat" className="space-y-3 pt-4">
                        <Label htmlFor="interest">Bidang yang paling menarik bagimu</Label>
                        <Input
                          id="interest"
                          value={interest}
                          onChange={(e) => setInterest(e.target.value)}
                          placeholder="Contoh: Statistika terapan"
                        />
                        <p className="text-xs text-muted-foreground">
                          Informasi ini membantu kami memberikan konteks dan contoh soal yang relevan.
                        </p>
                      </TabsContent>
                      <TabsContent value="tujuan" className="space-y-3 pt-4">
                        <Label htmlFor="goal">Apa target belajarmu 30 hari ke depan?</Label>
                        <Input
                          id="goal"
                          value={learningGoal}
                          onChange={(e) => setLearningGoal(e.target.value)}
                          placeholder="Contoh: Menyiapkan OSN Matematika"
                        />
                      </TabsContent>
                    </Tabs>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <Button variant="outline" onClick={() => setActiveStep(1)}>
                        Lewati
                      </Button>
                      <Button onClick={handleStartAssessment}>
                        Mulai Tes Awal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeStep === 1 && (
                <Card className="border-primary/40">
                  <CardHeader className="flex flex-col gap-2 border-b border-primary/20 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Soal {activeQuestionIndex + 1} dari {assessmentQuestions.length}</CardTitle>
                        <CardDescription>Topik: {currentQuestion.topicId.toUpperCase()}</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">Progress</p>
                        <Progress value={progressValue} className="h-2 w-32" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <p className="text-lg font-semibold text-foreground">{currentQuestion.text}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {currentQuestion.options.map((option) => {
                        const isSelected = answers[currentQuestion.id] === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleAnswer(option)}
                            className={cn(
                              "rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              isSelected
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-muted bg-card hover:border-primary/40",
                            )}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Jawaban benar meningkatkan tingkat kesulitan otomatis.</span>
                      <span>{assessmentQuestions.length - activeQuestionIndex - 1} soal tersisa</span>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleNextQuestion} disabled={!answers[currentQuestion.id]}>
                        {activeQuestionIndex === assessmentQuestions.length - 1 ? "Lihat Rekomendasi" : "Soal Berikutnya"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeStep === 2 && (
                <div className="grid gap-6 lg:grid-cols-[0.7fr,1fr]">
                  <Card className="border-accent/40">
                    <CardHeader>
                      <CardTitle>Profil Hasilmu</CardTitle>
                      <CardDescription>
                        Jalur belajar adaptif siap dijalankan dengan fokus pada area yang perlu diperdalam.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <CircularMastery percent={72} label="Estimasi Penguasaan" />
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p><strong>Minat:</strong> {interest}</p>
                        <p><strong>Tujuan:</strong> {learningGoal}</p>
                        <p><strong>Total Soal Dijawab:</strong> {assessmentQuestions.length}</p>
                      </div>
                      <Button className="w-full" onClick={handleCompleteOnboarding}>
                        {CTA_COPY_VARIANTS.startPractice[0]}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-muted/70">
                    <CardHeader>
                      <CardTitle>Rekomendasi Prioritas 7 Hari</CardTitle>
                      <CardDescription>Mulai dari topik dengan penguasaan terendah untuk kenaikan signifikan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recommendedTopics.map((topic, index) => (
                        <div
                          key={topic.id}
                          className="flex items-center justify-between rounded-lg border border-muted/60 p-4 hover:border-primary/40"
                        >
                          <div>
                            <p className="text-sm font-semibold">{index + 1}. {topic.title}</p>
                            <p className="text-xs text-muted-foreground">Penguasaan awal: {topic.mastery}%</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => navigate("/quiz", { state: { topicId: topic.id } })}>
                            {CTA_COPY_VARIANTS.startPractice[2]}
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
