import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckCircle2, XCircle, Info, Sparkles, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizQuestion } from "@/data/mockData";
import { fadeInUp, scaleIn, shake, hoverLift } from "@/lib/animations";

interface QuizCardProps {
  question: QuizQuestion;
  onSubmit: (answer: string | string[], isCorrect: boolean) => void;
  showFeedback?: boolean;
  className?: string;
  subjectInfo?: {
    name: string;
    color: string;
    code?: string;
  };
}

export const QuizCard = ({ 
  question, 
  onSubmit,
  showFeedback = false,
  className,
  subjectInfo
}: QuizCardProps) => {
  const [answer, setAnswer] = useState<string | string[]>("");
  const [multiAnswer, setMultiAnswer] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const userAnswer = question.type === 'multi-select' ? multiAnswer : answer;
    const correct = question.type === 'multi-select' 
      ? JSON.stringify(multiAnswer.sort()) === JSON.stringify((question.correctAnswer as string[]).sort())
      : (answer as string).toLowerCase() === (question.correctAnswer as string).toLowerCase();
    
    setIsCorrect(correct);
    setSubmitted(true);
    onSubmit(userAnswer, correct);
  };

  const handleMultiSelect = (option: string, checked: boolean) => {
    if (checked) {
      setMultiAnswer([...multiAnswer, option]);
    } else {
      setMultiAnswer(multiAnswer.filter(a => a !== option));
    }
  };

  const showNextHint = () => {
    if (hintIndex < question.hints.length - 1) {
      setHintIndex(hintIndex + 1);
      setShowHint(true);
    } else {
      setShowHint(true);
    }
  };

  return (
    <Card className={cn("animate-fade-in", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {subjectInfo && (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: subjectInfo.color }}
                />
                <Badge variant="outline" className="text-xs">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  {subjectInfo.name}
                </Badge>
              </div>
            )}
            <CardTitle className="text-xl">{question.question}</CardTitle>
          </div>
          <Badge variant={question.difficulty === 1 ? "secondary" : question.difficulty === 2 ? "default" : "destructive"}>
            {question.difficulty === 1 ? 'Mudah' : question.difficulty === 2 ? 'Sedang' : 'Sulit'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question Options */}
        {question.type === 'mcq' && (
          <RadioGroup value={answer as string} onValueChange={setAnswer} disabled={submitted}>
            {question.options?.map((option, index) => {
              const isSelected = answer === option;
              const isCorrectOption = submitted && option === question.correctAnswer;
              const isWrongSelection = submitted && isSelected && !isCorrectOption;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={!submitted ? { scale: 1.02, x: 5 } : {}}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer relative overflow-hidden",
                    isSelected && !submitted && "border-primary bg-primary/5",
                    isCorrectOption && "border-accent bg-accent/10",
                    isWrongSelection && "border-destructive bg-destructive/10",
                    !isSelected && !submitted && "border-transparent hover:border-muted hover:bg-muted/30"
                  )}
                >
                  {/* Glow effect for selected */}
                  {isSelected && !submitted && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  <RadioGroupItem value={option} id={`option-${index}`} className="relative z-10" />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer relative z-10">
                    {option}
                  </Label>
                  
                  {/* Correct/Wrong indicators */}
                  {isCorrectOption && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    </motion.div>
                  )}
                  {isWrongSelection && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <XCircle className="w-5 h-5 text-destructive" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </RadioGroup>
        )}

        {question.type === 'multi-select' && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">Pilih semua jawaban yang benar:</p>
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id={`multi-${index}`}
                  checked={multiAnswer.includes(option)}
                  onCheckedChange={(checked) => handleMultiSelect(option, checked as boolean)}
                  disabled={submitted}
                />
                <Label htmlFor={`multi-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )}

        {question.type === 'short-answer' && (
          <div className="space-y-2">
            <Label htmlFor="short-answer">Jawaban Anda:</Label>
            <Input
              id="short-answer"
              value={answer as string}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Ketik jawaban di sini..."
              disabled={submitted}
              className="text-lg"
            />
          </div>
        )}

        {/* Hint System */}
        {!submitted && question.hintCount > 0 && (
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={showNextHint}
              disabled={hintIndex >= question.hints.length - 1 && showHint}
              className="w-full"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHint ? `Petunjuk ${hintIndex + 1}/${question.hints.length}` : 'Tampilkan Petunjuk'}
            </Button>
            {showHint && (
              <Alert className="animate-slide-in">
                <Info className="h-4 w-4" />
                <AlertDescription>{question.hints[hintIndex]}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {submitted && showFeedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Alert 
                variant={isCorrect ? "default" : "destructive"} 
                className={cn(
                  "relative overflow-hidden",
                  isCorrect && "border-accent bg-accent/10"
                )}
              >
                {/* Animated background */}
                {isCorrect && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20"
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                )}
                
                <div className="flex items-start gap-3 relative z-10">
                  <motion.div
                    animate={isCorrect ? { 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.2, 1]
                    } : {
                      x: [-5, 5, -5, 5, 0]
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </motion.div>
                  <AlertDescription>
                    <strong className={isCorrect ? "text-accent" : ""}>
                      {isCorrect ? "Benar! 🎉" : "Belum tepat."}
                    </strong>
                    {" "}{question.explanation}
                  </AlertDescription>
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <AnimatePresence>
          {!submitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button 
                onClick={handleSubmit}
                disabled={
                  (question.type === 'mcq' && !answer) ||
                  (question.type === 'multi-select' && multiAnswer.length === 0) ||
                  (question.type === 'short-answer' && !answer)
                }
                className="w-full gradient-primary group relative overflow-hidden"
                size="lg"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{ x: [-200, 200] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Submit Jawaban
                </span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
