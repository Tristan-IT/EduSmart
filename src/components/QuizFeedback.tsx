/**
 * Quiz Feedback Component
 * AI-powered auto-grading and feedback for quiz answers
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle, Lightbulb, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface QuizFeedbackProps {
  questionId: string;
  correctAnswer?: string;
  rubric?: string;
  onFeedbackReceived?: (feedback: FeedbackResult) => void;
  className?: string;
}

interface FeedbackResult {
  score: number;
  feedback: string;
  suggestions: string[];
}

export function QuizFeedback({
  questionId,
  correctAnswer,
  rubric,
  onFeedbackReceived,
  className,
}: QuizFeedbackProps) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FeedbackResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setError("Jawaban tidak boleh kosong");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ai/quiz/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId,
          studentAnswer: answer,
          correctAnswer,
          rubric,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get feedback");
      }

      const apiResult = await response.json();
      setResult(apiResult.data);
      onFeedbackReceived?.(apiResult.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "Sangat Baik";
    if (score >= 60) return "Baik";
    if (score >= 40) return "Cukup";
    return "Perlu Perbaikan";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Auto-Grading
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Answer Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Jawaban Anda:</label>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Tulis jawaban Anda di sini..."
            rows={4}
            disabled={loading || !!result}
          />
        </div>

        {/* Submit Button */}
        {!result && (
          <Button
            onClick={handleSubmit}
            disabled={loading || !answer.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Dapatkan Feedback AI
              </>
            )}
          </Button>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Score Section */}
            <div className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-purple-500/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">Skor Anda</span>
                </div>
                <Badge variant="outline">{getScoreBadge(result.score)}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </span>
                  <span className="text-muted-foreground text-sm">/ 100</span>
                </div>
                <Progress value={result.score} className="h-2" />
              </div>
            </div>

            {/* Feedback */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                Feedback
              </h4>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm">
                {result.feedback}
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  Saran Perbaikan
                </h4>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className="text-sm p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2"
                    >
                      <span className="text-yellow-600 font-bold">{idx + 1}.</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Try Again Button */}
            <Button
              variant="outline"
              onClick={() => {
                setResult(null);
                setAnswer("");
              }}
              className="w-full"
            >
              Coba Lagi
            </Button>
          </motion.div>
        )}

        {/* Helper Info */}
        {!result && !loading && (
          <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
            <p className="font-medium mb-1">💡 Tips:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Tulis jawaban selengkap mungkin</li>
              <li>Jelaskan langkah-langkah penyelesaian</li>
              <li>AI akan memberikan feedback konstruktif</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
