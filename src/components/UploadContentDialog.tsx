import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, X, GraduationCap } from "lucide-react";
import { ContentItem } from "@/data/mockData";
import { subjectApi } from "@/lib/apiClient";

interface Subject {
  _id: string;
  code: string;
  name: string;
  category: string;
  color: string;
}

interface UploadContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (content: Omit<ContentItem, 'id' | 'updatedAt'>) => void;
}

export function UploadContentDialog({ isOpen, onClose, onUpload }: UploadContentDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    topic: 'algebra',
    type: 'video' as 'video' | 'pdf' | 'quiz' | 'slide',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    durationMinutes: 15,
    author: 'Bu Sarah Wijaya',
    tags: [] as string[],
    description: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadSubjects();
    }
  }, [isOpen]);

  const loadSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const response = await subjectApi.getAll();
      if (response.success && Array.isArray(response.subjects)) {
        setSubjects(response.subjects);
      } else {
        console.warn("No subjects returned or invalid format:", response);
        setSubjects([]);
      }
    } catch (error) {
      console.error("Failed to load subjects:", error);
      setSubjects([]);
      toast.error("Gagal memuat mata pelajaran");
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error("Judul materi harus diisi");
      return;
    }

    if (!formData.subjectId) {
      toast.error("Mata pelajaran harus dipilih");
      return;
    }

    onUpload({
      title: formData.title,
      topic: formData.topic,
      type: formData.type,
      difficulty: formData.difficulty,
      durationMinutes: formData.durationMinutes,
      author: formData.author,
      tags: formData.tags,
    });

    // Reset form
    setFormData({
      title: '',
      subjectId: '',
      topic: 'algebra',
      type: 'video',
      difficulty: 'beginner',
      durationMinutes: 15,
      author: 'Bu Sarah Wijaya',
      tags: [],
      description: '',
    });
    setTagInput('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Materi Baru</DialogTitle>
          <DialogDescription>
            Tambahkan materi pembelajaran baru ke perpustakaan konten
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Mata Pelajaran *</Label>
            <Select 
              value={formData.subjectId} 
              onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
              disabled={loadingSubjects}
            >
              <SelectTrigger>
                <GraduationCap className="h-4 w-4 mr-2" />
                <SelectValue placeholder={loadingSubjects ? "Memuat..." : "Pilih mata pelajaran"} />
              </SelectTrigger>
              <SelectContent>
                {subjects && subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: subject.color }}
                        />
                        {subject.name}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-subjects" disabled>
                    Tidak ada mata pelajaran tersedia
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Judul Materi *</Label>
            <Input
              id="title"
              placeholder="Contoh: Pengenalan Aljabar Dasar"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topik</Label>
              <Select value={formData.topic} onValueChange={(value) => setFormData({ ...formData, topic: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="algebra">Aljabar</SelectItem>
                  <SelectItem value="geometry">Geometri</SelectItem>
                  <SelectItem value="statistics">Statistika</SelectItem>
                  <SelectItem value="trigonometry">Trigonometri</SelectItem>
                  <SelectItem value="calculus">Kalkulus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipe Konten</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="slide">Slide Presentasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
              <Select value={formData.difficulty} onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Pemula</SelectItem>
                  <SelectItem value="intermediate">Menengah</SelectItem>
                  <SelectItem value="advanced">Lanjutan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durasi (menit)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 15 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Pembuat Materi</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              placeholder="Jelaskan tentang materi ini..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Tambahkan tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Tambah
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Klik untuk upload atau drag & drop file
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formData.type === 'video' ? 'MP4, AVI, MOV (Max 500MB)' :
                 formData.type === 'pdf' ? 'PDF (Max 50MB)' :
                 formData.type === 'slide' ? 'PPTX, PPT (Max 100MB)' :
                 'JSON, ZIP (Max 10MB)'}
              </p>
              <Input
                id="file"
                type="file"
                className="hidden"
                accept={
                  formData.type === 'video' ? 'video/*' :
                  formData.type === 'pdf' ? '.pdf' :
                  formData.type === 'slide' ? '.ppt,.pptx' :
                  '.json,.zip'
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Materi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
