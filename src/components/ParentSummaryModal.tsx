/**
 * Parent Summary Modal
 * AI-generated weekly progress summary for parents
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  Share2,
  Calendar,
  TrendingUp,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ParentSummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName?: string;
}

interface SummaryData {
  summary: {
    narrative: string;
    highlights: string[];
    concerns: string[];
    recommendations: string[];
  };
  metrics: {
    completedLessons: number;
    averageScore: number;
    streak: number;
    xpGained: number;
    timeSpentMinutes: number;
  };
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  cached?: boolean;
}

export function ParentSummaryModal({
  open,
  onOpenChange,
  studentId,
  studentName = "Siswa",
}: ParentSummaryModalProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && studentId) {
      fetchSummary();
    }
  }, [open, studentId]);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/ai/parent-summary/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const result = await response.json();
      setSummary(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!summary) return;

    const content = `
RINGKASAN PEMBELAJARAN MINGGUAN
${studentName}

Periode: ${new Date(summary.periodStart).toLocaleDateString("id-ID")} - ${new Date(summary.periodEnd).toLocaleDateString("id-ID")}

${summary.summary.narrative}

STATISTIK:
- Lessons Selesai: ${summary.metrics.completedLessons}
- Rata-rata Skor: ${summary.metrics.averageScore.toFixed(1)}%
- Streak: ${summary.metrics.streak} hari
- XP Diperoleh: ${summary.metrics.xpGained}
- Waktu Belajar: ${summary.metrics.timeSpentMinutes} menit

${summary.summary.highlights.length > 0 ? `\nHIGHLIGHTS:\n${summary.summary.highlights.map(h => `- ${h}`).join("\n")}` : ""}
${summary.summary.concerns.length > 0 ? `\nPERHATIAN:\n${summary.summary.concerns.map(c => `- ${c}`).join("\n")}` : ""}
${summary.summary.recommendations.length > 0 ? `\nREKOMENDASI:\n${summary.summary.recommendations.map(r => `- ${r}`).join("\n")}` : ""}

Dibuat: ${new Date(summary.generatedAt).toLocaleString("id-ID")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ringkasan-${studentName.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Ringkasan berhasil diunduh");
  };

  const handleShare = () => {
    if (!summary) return;

    const text = `Ringkasan Pembelajaran ${studentName}\n\n${summary.summary.narrative.substring(0, 200)}...`;

    if (navigator.share) {
      navigator
        .share({
          title: `Ringkasan Pembelajaran ${studentName}`,
          text,
        })
        .then(() => toast.success("Berhasil dibagikan"))
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Teks disalin ke clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Ringkasan Mingguan untuk Orang Tua
          </DialogTitle>
          <DialogDescription>
            Laporan progres pembelajaran {studentName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Period Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(summary.periodStart).toLocaleDateString("id-ID")} -{" "}
                  {new Date(summary.periodEnd).toLocaleDateString("id-ID")}
                </Badge>
                {summary.cached && (
                  <Badge variant="secondary">Dari Cache</Badge>
                )}
              </div>

              {/* Main Narrative */}
              <div className="prose prose-sm max-w-none">
                <div className="p-4 rounded-lg bg-muted/50 border whitespace-pre-wrap">
                  {summary.summary.narrative}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border bg-card">
                  <div className="text-2xl font-bold text-primary">
                    {summary.metrics.completedLessons}
                  </div>
                  <div className="text-xs text-muted-foreground">Lessons Selesai</div>
                </div>
                <div className="p-3 rounded-lg border bg-card">
                  <div className="text-2xl font-bold text-green-600">
                    {summary.metrics.averageScore.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Rata-rata Skor</div>
                </div>
                <div className="p-3 rounded-lg border bg-card">
                  <div className="text-2xl font-bold text-orange-600">
                    {summary.metrics.streak}
                  </div>
                  <div className="text-xs text-muted-foreground">Hari Streak</div>
                </div>
                <div className="p-3 rounded-lg border bg-card">
                  <div className="text-2xl font-bold text-purple-600">
                    {summary.metrics.xpGained}
                  </div>
                  <div className="text-xs text-muted-foreground">XP Diperoleh</div>
                </div>
                <div className="p-3 rounded-lg border bg-card col-span-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {summary.metrics.timeSpentMinutes} menit
                  </div>
                  <div className="text-xs text-muted-foreground">Waktu Belajar</div>
                </div>
              </div>

              {/* Highlights */}
              {summary.summary.highlights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Pencapaian
                  </h4>
                  <ul className="space-y-1">
                    {summary.summary.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="text-sm p-2 rounded bg-green-500/10 border border-green-500/20"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Concerns */}
              {summary.summary.concerns.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    Perhatian
                  </h4>
                  <ul className="space-y-1">
                    {summary.summary.concerns.map((concern, idx) => (
                      <li
                        key={idx}
                        className="text-sm p-2 rounded bg-orange-500/10 border border-orange-500/20"
                      >
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {summary.summary.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Rekomendasi
                  </h4>
                  <ul className="space-y-1">
                    {summary.summary.recommendations.map((rec, idx) => (
                      <li
                        key={idx}
                        className="text-sm p-2 rounded bg-blue-500/10 border border-blue-500/20"
                      >
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                Dibuat: {new Date(summary.generatedAt).toLocaleString("id-ID")}
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleShare} disabled={!summary}>
            <Share2 className="h-4 w-4 mr-2" />
            Bagikan
          </Button>
          <Button variant="outline" onClick={handleDownload} disabled={!summary}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={() => onOpenChange(false)}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
