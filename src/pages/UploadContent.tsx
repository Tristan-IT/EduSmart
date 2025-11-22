import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertMessage } from "@/components/AlertMessage";
import { apiClient } from "@/lib/apiClient";
import {
  Upload,
  File,
  Image as ImageIcon,
  Video,
  FileText,
  X,
  Check,
  AlertCircle,
  FolderOpen,
} from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  type: "video" | "image" | "document" | "other";
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  url?: string;
  error?: string;
}

export default function UploadContent() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const getFileType = (file: File): "video" | "image" | "document" | "other" => {
    const type = file.type;
    if (type.startsWith("video/")) return "video";
    if (type.startsWith("image/")) return "image";
    if (
      type.includes("pdf") ||
      type.includes("document") ||
      type.includes("word") ||
      type.includes("powerpoint") ||
      type.includes("presentation")
    ) {
      return "document";
    }
    return "other";
  };

  const validateFile = (file: File): string | null => {
    // Max size: 100MB for videos, 10MB for images, 20MB for documents
    const maxSizes: Record<string, number> = {
      video: 100 * 1024 * 1024,
      image: 10 * 1024 * 1024,
      document: 20 * 1024 * 1024,
      other: 10 * 1024 * 1024,
    };
    
    const fileType = getFileType(file);
    const maxSize = maxSizes[fileType];
    
    if (file.size > maxSize) {
      return `File too large. Max size for ${fileType}: ${maxSize / (1024 * 1024)}MB`;
    }
    
    // Validate file types
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/vnd.ms-powerpoint",
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return "File type not supported";
    }
    
    return null;
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        continue;
      }
      
      newFiles.push({
        id: Date.now().toString() + i,
        file,
        type: getFileType(file),
        status: "pending",
        progress: 0,
      });
    }
    
    setFiles([...files, ...newFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const uploadFile = async (uploadedFile: UploadedFile) => {
    try {
      // Update status to uploading
      setFiles(
        files.map((f) =>
          f.id === uploadedFile.id ? { ...f, status: "uploading" as const, progress: 0 } : f
        )
      );

      // Create form data
      const formData = new FormData();
      formData.append("file", uploadedFile.file);
      formData.append("type", uploadedFile.type);

      // Upload with progress tracking
      // @ts-ignore - Extended options for upload progress
      const response = await apiClient.post("/api/teacher/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.id === uploadedFile.id ? { ...f, progress } : f
            )
          );
        },
      });

      // Update status to success
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === uploadedFile.id
            // @ts-ignore - API response type
            ? { ...f, status: "success" as const, progress: 100, url: response.data.url }
            : f
        )
      );

    } catch (err: any) {
      // Update status to error
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === uploadedFile.id
            ? { ...f, status: "error" as const, error: err.response?.data?.message || "Upload failed" }
            : f
        )
      );
      setError(`Failed to upload ${uploadedFile.file.name}`);
    }
  };

  const handleUploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    
    for (const file of pendingFiles) {
      await uploadFile(file);
    }
    
    const allSuccess = files.every((f) => f.status === "success");
    if (allSuccess) {
      setSuccess("All files uploaded successfully!");
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const handleRetry = (uploadedFile: UploadedFile) => {
    uploadFile(uploadedFile);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-8 h-8 text-purple-500" />;
      case "image":
        return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case "document":
        return <FileText className="w-8 h-8 text-red-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Upload Content</h1>
          <p className="text-muted-foreground">
            Upload videos, images, documents, and other learning materials
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/teacher/templates")}>
          <FolderOpen className="w-4 h-4 mr-2" />
          Browse Templates
        </Button>
      </div>

      {/* Alerts */}
      {error && <AlertMessage type="danger" message={error} onClose={() => setError(null)} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Drag and drop files or click to browse. Supported: Videos (MP4, WebM), Images (JPG, PNG, GIF), Documents
            (PDF, DOCX, PPTX)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-semibold mb-2">
              {dragActive ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
            <Button type="button" variant="outline">
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
              accept="video/*,image/*,.pdf,.doc,.docx,.ppt,.pptx"
            />
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Files ({files.length})</CardTitle>
                <CardDescription>
                  {files.filter((f) => f.status === "success").length} uploaded,{" "}
                  {files.filter((f) => f.status === "pending").length} pending
                </CardDescription>
              </div>
              <Button
                onClick={handleUploadAll}
                disabled={files.filter((f) => f.status === "pending").length === 0}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload All ({files.filter((f) => f.status === "pending").length})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((uploadedFile) => (
                <div
                  key={uploadedFile.id}
                  className="border rounded-lg p-4 flex items-center gap-4"
                >
                  {/* File Icon */}
                  <div className="flex-shrink-0">{getFileIcon(uploadedFile.type)}</div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate">{uploadedFile.file.name}</p>
                      <span className="text-sm text-muted-foreground ml-2">
                        {formatFileSize(uploadedFile.file.size)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {uploadedFile.status === "uploading" && (
                      <div className="space-y-1">
                        <Progress value={uploadedFile.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Uploading... {uploadedFile.progress}%
                        </p>
                      </div>
                    )}

                    {/* Success Message */}
                    {uploadedFile.status === "success" && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Check className="w-4 h-4" />
                        <span>Uploaded successfully</span>
                      </div>
                    )}

                    {/* Error Message */}
                    {uploadedFile.status === "error" && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>{uploadedFile.error}</span>
                      </div>
                    )}

                    {/* Pending */}
                    {uploadedFile.status === "pending" && (
                      <p className="text-sm text-muted-foreground">Ready to upload</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {uploadedFile.status === "error" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetry(uploadedFile)}
                      >
                        Retry
                      </Button>
                    )}
                    {uploadedFile.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => uploadFile(uploadedFile)}
                      >
                        Upload
                      </Button>
                    )}
                    {uploadedFile.status !== "uploading" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(uploadedFile.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Media Library */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>Your recently uploaded files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files
              .filter((f) => f.status === "success")
              .slice(0, 8)
              .map((file) => (
                <div
                  key={file.id}
                  className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="aspect-square bg-muted rounded flex items-center justify-center mb-2">
                    {getFileIcon(file.type)}
                  </div>
                  <p className="text-sm font-medium truncate">{file.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.file.size)}
                  </p>
                </div>
              ))}
          </div>
          {files.filter((f) => f.status === "success").length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No files uploaded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
