import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, FileQuestion, Clock, Star, Download, User, Calendar } from "lucide-react";

interface Template {
  _id: string;
  title: string;
  description: string;
  type: "lesson" | "quiz" | "video" | "document";
  category: string;
  subject: string;
  gradeLevel: string;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  duration: number;
  tags: string[];
  author: string;
  rating: number;
  downloads: number;
  content?: any;
  createdAt: string;
}

interface TemplatePreviewModalProps {
  template: Template;
  isOpen: boolean;
  onClose: () => void;
  onUse: () => void;
}

export default function TemplatePreviewModal({ template, isOpen, onClose, onUse }: TemplatePreviewModalProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Mudah":
        return "bg-green-100 text-green-800";
      case "Sedang":
        return "bg-yellow-100 text-yellow-800";
      case "Sulit":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Mock content based on type
  const getMockContent = () => {
    if (template.type === "lesson") {
      return {
        objectives: [
          "Memahami konsep dasar " + template.title,
          "Mampu menjelaskan prinsip-prinsip utama",
          "Dapat menerapkan dalam soal latihan",
        ],
        outline: [
          { title: "Pendahuluan", duration: "10 menit" },
          { title: "Materi Inti", duration: "25 menit" },
          { title: "Latihan Soal", duration: "15 menit" },
          { title: "Kesimpulan", duration: "5 menit" },
        ],
        materials: ["Slide presentasi", "Video penjelasan", "Lembar kerja siswa", "Kunci jawaban"],
      };
    } else if (template.type === "quiz") {
      return {
        questionCount: 20,
        questionTypes: ["Pilihan Ganda", "Isian Singkat", "Essay"],
        topics: template.tags,
        timeLimit: template.duration,
        sampleQuestions: [
          {
            question: "Apa yang dimaksud dengan " + template.tags[0] + "?",
            options: ["A. Opsi 1", "B. Opsi 2", "C. Opsi 3", "D. Opsi 4"],
            correctAnswer: "A",
          },
          {
            question: "Sebutkan 3 karakteristik utama dari " + template.tags[0],
            type: "essay",
          },
        ],
      };
    } else if (template.type === "video") {
      return {
        duration: template.duration + " menit",
        format: "MP4 1080p",
        subtitle: "Bahasa Indonesia",
        chapters: [
          { title: "Intro", time: "0:00" },
          { title: "Konsep Dasar", time: "2:30" },
          { title: "Contoh Soal", time: "8:45" },
          { title: "Kesimpulan", time: "13:20" },
        ],
      };
    }
    return {};
  };

  const content = getMockContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{template.title}</DialogTitle>
              <DialogDescription className="mt-2">{template.description}</DialogDescription>
            </div>
            <Badge className={getDifficultyColor(template.difficulty)}>{template.difficulty}</Badge>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{template.duration} min</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-muted-foreground" />
              <span>{template.rating.toFixed(1)} Rating</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Download className="w-4 h-4 text-muted-foreground" />
              <span>{template.downloads} Downloads</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{template.author}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary">{template.type}</Badge>
            <Badge variant="secondary">{template.gradeLevel}</Badge>
            <Badge variant="secondary">{template.category}</Badge>
            {template.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="flex-1">
              Content
            </TabsTrigger>
            <TabsTrigger value="sample" className="flex-1">
              Sample
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="overview" className="space-y-4 pr-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>

              {template.type === "lesson" && content.objectives && (
                <div>
                  <h3 className="font-semibold mb-2">Learning Objectives</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {content.objectives.map((obj: string, idx: number) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {template.type === "lesson" && content.materials && (
                <div>
                  <h3 className="font-semibold mb-2">Materials Included</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {content.materials.map((material: string, idx: number) => (
                      <li key={idx}>{material}</li>
                    ))}
                  </ul>
                </div>
              )}

              {template.type === "quiz" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Question Count</h3>
                    <p className="text-2xl font-bold text-primary">{content.questionCount}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Time Limit</h3>
                    <p className="text-2xl font-bold text-primary">{content.timeLimit} min</p>
                  </div>
                </div>
              )}

              {template.type === "video" && content.chapters && (
                <div>
                  <h3 className="font-semibold mb-2">Chapters</h3>
                  <div className="space-y-2">
                    {content.chapters.map((chapter: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                        <span>{chapter.title}</span>
                        <span className="text-muted-foreground">{chapter.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="content" className="space-y-4 pr-4">
              {template.type === "lesson" && content.outline && (
                <div>
                  <h3 className="font-semibold mb-3">Lesson Outline</h3>
                  <div className="space-y-3">
                    {content.outline.map((section: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{section.title}</h4>
                          <Badge variant="outline">{section.duration}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {template.type === "quiz" && content.questionTypes && (
                <div>
                  <h3 className="font-semibold mb-3">Question Types</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {content.questionTypes.map((type: string, idx: number) => (
                      <div key={idx} className="border rounded-lg p-3 text-center">
                        <FileQuestion className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">{type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sample" className="space-y-4 pr-4">
              {template.type === "quiz" && content.sampleQuestions && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Sample Questions</h3>
                  {content.sampleQuestions.map((q: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-3">
                      <p className="font-medium">
                        {idx + 1}. {q.question}
                      </p>
                      {q.options && (
                        <div className="space-y-2 ml-4">
                          {q.options.map((option: string, optIdx: number) => (
                            <div
                              key={optIdx}
                              className={`p-2 rounded ${
                                option.startsWith(q.correctAnswer) ? "bg-green-100 border border-green-300" : "bg-muted"
                              }`}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                      {q.type === "essay" && (
                        <div className="ml-4 p-3 bg-muted rounded">
                          <p className="text-sm text-muted-foreground">Essay question - Students will write their answer here</p>
                        </div>
                      )}
                    </div>
                  ))}
                  <p className="text-sm text-muted-foreground text-center">... and {content.questionCount - 2} more questions</p>
                </div>
              )}

              {template.type === "lesson" && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Sample Content</h3>
                  <div className="prose prose-sm max-w-none">
                    <h4>Introduction</h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
                      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                    <h4>Main Concepts</h4>
                    <ul>
                      <li>Concept 1: Explanation of the first key concept</li>
                      <li>Concept 2: Detailed description of the second concept</li>
                      <li>Concept 3: Important points about the third concept</li>
                    </ul>
                    <h4>Examples</h4>
                    <p>Example problems and solutions would be included here with step-by-step explanations.</p>
                  </div>
                </div>
              )}

              {template.type === "video" && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Video Preview</h3>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Video preview not available</p>
                      <p className="text-sm text-muted-foreground mt-2">Full video available after download</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onUse}>
            <Download className="w-4 h-4 mr-2" />
            Use This Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
