/**
 * Teacher Insights Component
 * Displays AI-powered class insights and recommendations
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, TrendingUp, Lightbulb, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface TeacherInsightsProps {
  classId: string;
  className?: string;
}

interface InsightData {
  risks: Array<{
    studentName: string;
    reason: string;
    priority: "high" | "medium" | "low";
  }>;
  recommendations: string[];
  highlights: string[];
}

export function TeacherInsights({ classId, className }: TeacherInsightsProps) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async (window: "7d" | "30d" = "7d") => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ai/teacher/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ classId, window }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }

      const result = await response.json();
      setInsights(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Class Insights
        </CardTitle>
        <CardDescription>
          Analisis performa kelas dan rekomendasi intervensi
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!insights && !loading && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">
              Klik tombol untuk menganalisis performa kelas
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => fetchInsights("7d")} variant="default">
                Analisis 7 Hari
              </Button>
              <Button onClick={() => fetchInsights("30d")} variant="outline">
                Analisis 30 Hari
              </Button>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Menganalisis data kelas...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* At-Risk Students */}
            {insights.risks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Siswa Perlu Perhatian
                </h4>
                <div className="space-y-2">
                  {insights.risks.map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border bg-muted/50 space-y-1"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm">{risk.studentName}</p>
                        <Badge variant={getPriorityColor(risk.priority)}>
                          {risk.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{risk.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {insights.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Rekomendasi Aksi
                </h4>
                <ul className="space-y-2">
                  {insights.recommendations.map((rec, idx) => (
                    <li
                      key={idx}
                      className="text-sm p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                    >
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Highlights */}
            {insights.highlights.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Highlights Positif
                </h4>
                <ul className="space-y-2">
                  {insights.highlights.map((highlight, idx) => (
                    <li
                      key={idx}
                      className="text-sm p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={() => fetchInsights("7d")}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Refresh Analisis
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
