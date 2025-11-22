/**
 * Content Copilot Drawer
 * AI-powered content generation assistant for teachers
 */

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  Wand2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ContentCopilotProps {
  trigger?: React.ReactNode;
  onContentGenerated?: (content: GeneratedContent) => void;
}

interface GeneratedContent {
  content: string;
  metadata: {
    estimatedTime: number;
    difficulty: string;
    tags: string[];
  };
  reviewNotes: string;
}

export function ContentCopilot({ trigger, onContentGenerated }: ContentCopilotProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("lesson");
  const [subject, setSubject] = useState("Matematika");
  const [gradeLevel, setGradeLevel] = useState("SMA");
  const [tone, setTone] = useState("friendly");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Prompt tidak boleh kosong");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ai/content/copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          contentType,
          subject,
          gradeLevel,
          tone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const apiResult = await response.json();
      setResult(apiResult.data);
      onContentGenerated?.(apiResult.data);
      toast.success("Konten berhasil dibuat!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    toast.success("Konten disalin ke clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPrompt("");
    setResult(null);
    setError(null);
    setCopied(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Wand2 className="h-4 w-4" />
            AI Content Copilot
          </Button>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Content Generator
          </SheetTitle>
          <SheetDescription>
            Buat materi pembelajaran dengan bantuan AI
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {!result ? (
            <>
              {/* Prompt Input */}
              <div className="space-y-2">
                <Label htmlFor="prompt">Deskripsi Konten</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Contoh: Buat penjelasan tentang teorema Pythagoras dengan contoh soal..."
                  rows={4}
                  disabled={loading}
                />
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contentType">Tipe Konten</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger id="contentType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lesson">Lesson</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="exercise">Latihan</SelectItem>
                      <SelectItem value="summary">Ringkasan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Mata Pelajaran</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger id="subject">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Matematika">Matematika</SelectItem>
                      <SelectItem value="Fisika">Fisika</SelectItem>
                      <SelectItem value="Kimia">Kimia</SelectItem>
                      <SelectItem value="Biologi">Biologi</SelectItem>
                      <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
                      <SelectItem value="Bahasa Inggris">Bahasa Inggris</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Tingkat</Label>
                  <Select value={gradeLevel} onValueChange={setGradeLevel}>
                    <SelectTrigger id="gradeLevel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SD">SD</SelectItem>
                      <SelectItem value="SMP">SMP</SelectItem>
                      <SelectItem value="SMA">SMA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Gaya Bahasa</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Ramah</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Santai</SelectItem>
                      <SelectItem value="motivational">Motivasi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Error */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Membuat Konten...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Konten
                  </>
                )}
              </Button>

              {/* Example Prompts */}
              <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-2">
                <p className="font-medium">💡 Contoh Prompt:</p>
                <ul className="space-y-1 ml-4 list-disc text-muted-foreground">
                  <li>Buat penjelasan singkat tentang persamaan kuadrat</li>
                  <li>Buatkan 5 soal pilihan ganda tentang momentum</li>
                  <li>Jelaskan fotosintesis dengan analogi sederhana</li>
                </ul>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Metadata */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  ⏱️ {result.metadata.estimatedTime} menit
                </Badge>
                <Badge variant="outline">
                  📊 {result.metadata.difficulty}
                </Badge>
                {result.metadata.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Generated Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Konten yang Dibuat
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Salin
                      </>
                    )}
                  </Button>
                </div>
                <div className="p-4 rounded-lg border bg-card max-h-96 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-sans">
                    {result.content}
                  </pre>
                </div>
              </div>

              {/* Review Notes */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Catatan Review:</strong> {result.reviewNotes}
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  Buat Lagi
                </Button>
                <Button onClick={() => setOpen(false)} className="flex-1">
                  Selesai
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
