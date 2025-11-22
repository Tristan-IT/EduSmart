import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertMessage } from "@/components/AlertMessage";
import { apiClient } from "@/lib/apiClient";
import { ContentCopilot } from "@/components/ContentCopilot";
import {
  Save,
  Eye,
  Upload,
  Plus,
  Trash2,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Code,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: "multiple-choice" | "essay" | "short-answer" | "true-false";
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  points: number;
}

interface LessonContent {
  _id?: string;
  title: string;
  description: string;
  type: "lesson" | "quiz" | "video" | "document";
  subject: string;
  gradeLevel: string;
  classNumber: number;
  semester: number;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  tags: string[];
  duration: number;
  
  // Lesson specific
  objectives?: string[];
  content?: string;
  materials?: string[];
  
  // Quiz specific
  questions?: Question[];
  passingScore?: number;
  
  // Video specific
  videoUrl?: string;
  thumbnail?: string;
  
  // Metadata
  isTemplate: boolean;
  school?: string;
}

export default function ContentEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get("templateId");
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [content, setContent] = useState<LessonContent>({
    title: "",
    description: "",
    type: "lesson",
    subject: "",
    gradeLevel: "SMP",
    classNumber: 7,
    semester: 1,
    difficulty: "Sedang",
    tags: [],
    duration: 45,
    objectives: [""],
    content: "",
    materials: [],
    questions: [],
    passingScore: 60,
    isTemplate: false,
  });
  
  const [activeTab, setActiveTab] = useState("basic");
  const [tagInput, setTagInput] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    }
  }, [templateId]);

  const loadTemplate = async (id: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/templates/${id}`);
      // @ts-ignore - API response type
      setContent({ ...response.data, isTemplate: false, _id: undefined });
      setError(null);
    } catch (err: any) {
      setError("Failed to load template");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validation
      if (!content.title || !content.description) {
        setError("Title and description are required");
        return;
      }
      
      if (content.type === "lesson" && !content.content) {
        setError("Lesson content is required");
        return;
      }
      
      if (content.type === "quiz" && (!content.questions || content.questions.length === 0)) {
        setError("Quiz must have at least one question");
        return;
      }
      
      // Save to API
      const response = await apiClient.post("/api/teacher/content", content);
      setSuccess("Content saved successfully!");
      
      // Navigate to content list after 2 seconds
      setTimeout(() => {
        navigate("/teacher/content-management");
      }, 2000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const handleAddObjective = () => {
    setContent({
      ...content,
      objectives: [...(content.objectives || []), ""],
    });
  };

  const handleUpdateObjective = (index: number, value: string) => {
    const updated = [...(content.objectives || [])];
    updated[index] = value;
    setContent({ ...content, objectives: updated });
  };

  const handleRemoveObjective = (index: number) => {
    const updated = content.objectives?.filter((_, i) => i !== index) || [];
    setContent({ ...content, objectives: updated });
  };

  const handleAddTag = () => {
    if (tagInput && !content.tags.includes(tagInput)) {
      setContent({
        ...content,
        tags: [...content.tags, tagInput],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setContent({
      ...content,
      tags: content.tags.filter((t) => t !== tag),
    });
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
      points: 5,
    };
    
    setContent({
      ...content,
      questions: [...(content.questions || []), newQuestion],
    });
  };

  const handleUpdateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...(content.questions || [])];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, questions: updated });
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...(content.questions || [])];
    const options = [...(updated[qIndex].options || [])];
    options[optIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options };
    setContent({ ...content, questions: updated });
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = content.questions?.filter((_, i) => i !== index) || [];
    setContent({ ...content, questions: updated });
  };

  const insertMarkdown = (syntax: string, placeholder: string = "text") => {
    const textarea = document.getElementById("content-editor") as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.content?.substring(start, end) || placeholder;
    const before = content.content?.substring(0, start) || "";
    const after = content.content?.substring(end) || "";
    
    let newText = "";
    if (syntax === "link") {
      newText = `${before}[${selectedText}](url)${after}`;
    } else if (syntax === "image") {
      newText = `${before}![${selectedText}](image-url)${after}`;
    } else {
      newText = `${before}${syntax}${selectedText}${syntax}${after}`;
    }
    
    setContent({ ...content, content: newText });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Editor</h1>
          <p className="text-muted-foreground">
            {templateId ? "Customize template and create your content" : "Create new learning content"}
          </p>
        </div>
        <div className="flex gap-2">
          <ContentCopilot
            onContentGenerated={(generated) => {
              if (content.type === "lesson" && generated.content) {
                setContent({ ...content, content: generated.content });
              } else if (content.type === "quiz" && generated.content) {
                setContent({ ...content, description: generated.content });
              }
            }}
          />
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "Edit" : "Preview"}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Content"}
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && <AlertMessage type="danger" message={error} onClose={() => setError(null)} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
          <TabsTrigger value="content" className="flex-1">
            {content.type === "quiz" ? "Questions" : "Content"}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Title, description, and classification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={content.title}
                    onChange={(e) => setContent({ ...content, title: e.target.value })}
                    placeholder="Enter content title"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={content.description}
                    onChange={(e) => setContent({ ...content, description: e.target.value })}
                    placeholder="Brief description of the content"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="type">Content Type</Label>
                  <Select value={content.type} onValueChange={(v: any) => setContent({ ...content, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lesson">Lesson</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={content.subject}
                    onChange={(e) => setContent({ ...content, subject: e.target.value })}
                    placeholder="e.g., Matematika"
                  />
                </div>

                <div>
                  <Label htmlFor="gradeLevel">Grade Level</Label>
                  <Select value={content.gradeLevel} onValueChange={(v) => setContent({ ...content, gradeLevel: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SD">SD</SelectItem>
                      <SelectItem value="SMP">SMP</SelectItem>
                      <SelectItem value="SMA">SMA</SelectItem>
                      <SelectItem value="SMK">SMK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="classNumber">Class</Label>
                  <Select
                    value={content.classNumber.toString()}
                    onValueChange={(v) => setContent({ ...content, classNumber: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Class {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    value={content.semester.toString()}
                    onValueChange={(v) => setContent({ ...content, semester: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Semester 1</SelectItem>
                      <SelectItem value="2">Semester 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={content.difficulty} onValueChange={(v: any) => setContent({ ...content, difficulty: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mudah">Mudah</SelectItem>
                      <SelectItem value="Sedang">Sedang</SelectItem>
                      <SelectItem value="Sulit">Sulit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={content.duration}
                    onChange={(e) => setContent({ ...content, duration: parseInt(e.target.value) })}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" onClick={handleAddTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {content.tags.map((tag, idx) => (
                      <div key={idx} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives (Lesson only) */}
          {content.type === "lesson" && (
            <Card>
              <CardHeader>
                <CardTitle>Learning Objectives</CardTitle>
                <CardDescription>What students will learn from this lesson</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {content.objectives?.map((obj, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={obj}
                      onChange={(e) => handleUpdateObjective(idx, e.target.value)}
                      placeholder="Learning objective"
                    />
                    <Button variant="outline" size="icon" onClick={() => handleRemoveObjective(idx)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={handleAddObjective}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Objective
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-6">
          {content.type === "lesson" && (
            <Card>
              <CardHeader>
                <CardTitle>Lesson Content</CardTitle>
                <CardDescription>Write your lesson using Markdown formatting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Markdown Toolbar */}
                <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-lg">
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown("**", "bold text")}>
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown("*", "italic text")}>
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown("- ", "list item")}>
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown("link")}>
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown("image")}>
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown("```\n", "\n```")}>
                    <Code className="w-4 h-4" />
                  </Button>
                </div>

                <Textarea
                  id="content-editor"
                  value={content.content}
                  onChange={(e) => setContent({ ...content, content: e.target.value })}
                  placeholder="Write your lesson content here using Markdown..."
                  rows={20}
                  className="font-mono"
                />
              </CardContent>
            </Card>
          )}

          {content.type === "quiz" && (
            <div className="space-y-4">
              {content.questions?.map((question, qIdx) => (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Question {qIdx + 1}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveQuestion(qIdx)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Question Type</Label>
                      <Select
                        value={question.type}
                        onValueChange={(v: any) => handleUpdateQuestion(qIdx, "type", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="essay">Essay</SelectItem>
                          <SelectItem value="short-answer">Short Answer</SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Question</Label>
                      <Textarea
                        value={question.question}
                        onChange={(e) => handleUpdateQuestion(qIdx, "question", e.target.value)}
                        placeholder="Enter your question"
                        rows={3}
                      />
                    </div>

                    {question.type === "multiple-choice" && (
                      <div className="space-y-2">
                        <Label>Options</Label>
                        {question.options?.map((option, optIdx) => (
                          <div key={optIdx} className="flex gap-2">
                            <Input
                              value={option}
                              onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                            />
                          </div>
                        ))}
                        <div>
                          <Label>Correct Answer</Label>
                          <Select
                            value={question.correctAnswer as string}
                            onValueChange={(v) => handleUpdateQuestion(qIdx, "correctAnswer", v)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {question.options?.map((_, optIdx) => (
                                <SelectItem key={optIdx} value={String.fromCharCode(65 + optIdx)}>
                                  Option {String.fromCharCode(65 + optIdx)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {question.type === "true-false" && (
                      <div>
                        <Label>Correct Answer</Label>
                        <Select
                          value={question.correctAnswer as string}
                          onValueChange={(v) => handleUpdateQuestion(qIdx, "correctAnswer", v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">True</SelectItem>
                            <SelectItem value="false">False</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label>Explanation (Optional)</Label>
                      <Textarea
                        value={question.explanation}
                        onChange={(e) => handleUpdateQuestion(qIdx, "explanation", e.target.value)}
                        placeholder="Explain the answer"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Points</Label>
                      <Input
                        type="number"
                        value={question.points}
                        onChange={(e) => handleUpdateQuestion(qIdx, "points", parseInt(e.target.value))}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={handleAddQuestion} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Additional Settings</CardTitle>
              <CardDescription>Configure advanced options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.type === "quiz" && (
                <div>
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    value={content.passingScore}
                    onChange={(e) => setContent({ ...content, passingScore: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                  />
                </div>
              )}

              {content.type === "video" && (
                <>
                  <div>
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input
                      id="videoUrl"
                      value={content.videoUrl}
                      onChange={(e) => setContent({ ...content, videoUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                    <Input
                      id="thumbnail"
                      value={content.thumbnail}
                      onChange={(e) => setContent({ ...content, thumbnail: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
