/**
 * Enhanced Skill Tree Component
 * Supports class-level filtering, multiple subjects, and backend integration
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { BookOpen, ChevronRight, Filter, GraduationCap, Trophy } from "lucide-react";
import { NodeTooltip } from "./NodeTooltip";
import { NodePreviewModal } from "./NodePreviewModal";
import { useSkillTreeTheme } from "@/hooks/useSkillTreeTheme";
import { getBackgroundGradientClass, getNodeGradientClass, getThemeIcon } from "@/lib/skillTreeThemes";

// Type definitions matching backend SkillTreeNode
export interface SkillTreeNode {
  id: string;
  name: string;
  description: string;
  topicCode: string;
  subject: string;
  gradeLevel: "SD" | "SMP" | "SMA" | "SMK";
  classNumber: number;
  semester: number;
  curriculum: "Kurikulum Merdeka" | "K13";
  kompetensiDasar?: string;
  icon: string;
  color: string;
  level: number;
  xpRequired: number;
  prerequisites: string[];
  rewards: {
    xp: number;
    gems: number;
    hearts?: number;
    badge?: string;
    certificate?: string;
  };
  position: { x: number; y: number };
  quizCount: number;
  estimatedMinutes: number;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  isCheckpoint: boolean;
  status?: "locked" | "available" | "in-progress" | "completed";
  progress?: number; // 0-100
  stars?: number; // 0-3
}

interface EnhancedSkillTreeProps {
  nodes: SkillTreeNode[];
  userProgress?: Record<string, { status: string; progress: number; stars: number }>;
  onNodeClick?: (node: SkillTreeNode) => void;
  onStartQuiz?: (node: SkillTreeNode) => void;
  className?: string;
}

export function EnhancedSkillTree({
  nodes,
  userProgress = {},
  onNodeClick,
  onStartQuiz,
  className
}: EnhancedSkillTreeProps) {
  const [selectedClass, setSelectedClass] = useState<number | "all">("all");
  const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
  const [selectedSubject, setSelectedSubject] = useState<string | "all">("all");
  const [previewNode, setPreviewNode] = useState<SkillTreeNode | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Apply theme based on selected subject
  const theme = useSkillTreeTheme(
    selectedSubject !== "all" ? selectedSubject : undefined
  );

  // Extract unique values for filters
  const { classes, subjects, gradeLevel } = useMemo(() => {
    const classSet = new Set<number>();
    const subjectSet = new Set<string>();
    let grade = "SD" as "SD" | "SMP" | "SMA" | "SMK";

    nodes.forEach(node => {
      classSet.add(node.classNumber);
      subjectSet.add(node.subject);
      grade = node.gradeLevel;
    });

    return {
      classes: Array.from(classSet).sort((a, b) => a - b),
      subjects: Array.from(subjectSet).sort(),
      gradeLevel: grade
    };
  }, [nodes]);

  // Filter nodes based on selection
  const filteredNodes = useMemo(() => {
    let filtered = nodes;

    if (selectedClass !== "all") {
      filtered = filtered.filter(n => n.classNumber === selectedClass);
    }

    if (selectedSemester !== "all") {
      filtered = filtered.filter(n => n.semester === selectedSemester);
    }

    if (selectedSubject !== "all") {
      filtered = filtered.filter(n => n.subject === selectedSubject);
    }

    // Merge with user progress
    return filtered.map(node => ({
      ...node,
      status: userProgress[node.id]?.status as any || (node.prerequisites.length === 0 ? "available" : "locked"),
      progress: userProgress[node.id]?.progress || 0,
      stars: userProgress[node.id]?.stars || 0
    }));
  }, [nodes, selectedClass, selectedSemester, selectedSubject, userProgress]);

  // Group nodes by level for vertical progression display
  const nodesByLevel = useMemo(() => {
    const grouped: Record<number, SkillTreeNode[]> = {};
    filteredNodes.forEach(node => {
      if (!grouped[node.level]) {
        grouped[node.level] = [];
      }
      grouped[node.level].push(node);
    });
    return grouped;
  }, [filteredNodes]);

  const levels = Object.keys(nodesByLevel).map(Number).sort((a, b) => a - b);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    if (filteredNodes.length === 0) return 0;
    const completed = filteredNodes.filter(n => n.status === "completed").length;
    return Math.round((completed / filteredNodes.length) * 100);
  }, [filteredNodes]);

  const totalXP = useMemo(() => {
    return filteredNodes
      .filter(n => n.status === "completed")
      .reduce((sum, n) => sum + n.rewards.xp, 0);
  }, [filteredNodes]);

  const handleNodeClick = (node: SkillTreeNode) => {
    setPreviewNode(node);
    setShowPreview(true);
    onNodeClick?.(node);
  };

  const handleViewLesson = () => {
    if (previewNode) {
      // Navigate to lesson viewer
      window.location.href = `/lesson?nodeId=${previewNode.id}`;
    }
  };

  const handleStartQuiz = () => {
    if (previewNode) {
      onStartQuiz?.(previewNode);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Skill Tree - {gradeLevel} Kelas {classes.join(", ")}
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                <Trophy className="w-3 h-3 mr-1" />
                {totalXP} XP
              </Badge>
              <Badge variant="outline" className="text-sm">
                {filteredNodes.filter(n => n.status === "completed").length}/{filteredNodes.length} Selesai
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress Keseluruhan</span>
              <span className="font-semibold">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kelas</label>
              <Select value={selectedClass.toString()} onValueChange={(v) => setSelectedClass(v === "all" ? "all" : Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {classes.map(c => (
                    <SelectItem key={c} value={c.toString()}>Kelas {c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Semester</label>
              <Select value={selectedSemester.toString()} onValueChange={(v) => setSelectedSemester(v === "all" ? "all" : Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Semester</SelectItem>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mata Pelajaran</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                  {subjects.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill Tree Visualization */}
      <Card className={theme ? `transition-colors duration-300` : ''} 
            style={theme ? { backgroundColor: theme.colors.background } : {}}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Jalur Pembelajaran
            {theme && (
              <Badge variant="outline" style={{ 
                borderColor: theme.colors.primary,
                color: theme.colors.primary 
              }}>
                {theme.name}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNodes.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Tidak ada skill tree untuk filter yang dipilih
            </div>
          ) : (
            <div className="space-y-8">
              {levels.map((level, levelIndex) => (
                <div key={level} className="relative">
                  {/* Level indicator */}
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="font-mono"
                           style={theme ? { 
                             borderColor: theme.colors.primary,
                             color: theme.colors.primary 
                           } : {}}>
                      Level {level}
                    </Badge>
                    <div className="h-px flex-1 bg-border" 
                         style={theme ? { backgroundColor: theme.colors.connectionLine } : {}} />
                  </div>

                  {/* Nodes at this level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nodesByLevel[level].map((node) => (
                      <SkillNodeCard
                        key={node.id}
                        node={node}
                        theme={theme}
                        onClick={() => handleNodeClick(node)}
                        onStartQuiz={() => {
                          setPreviewNode(node);
                          onStartQuiz?.(node);
                        }}
                      />
                    ))}
                  </div>

                  {/* Connection line to next level */}
                  {levelIndex < levels.length - 1 && (
                    <div className="flex justify-center my-6">
                      <ChevronRight className="w-6 h-6 text-muted-foreground rotate-90"
                                    style={theme ? { color: theme.colors.connectionLine } : {}} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <NodePreviewModal
        node={previewNode}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onViewLesson={handleViewLesson}
        onStartQuiz={handleStartQuiz}
        userProgress={previewNode ? userProgress[previewNode.id] : undefined}
      />
    </div>
  );
}

// Individual Skill Node Card
function SkillNodeCard({
  node,
  theme,
  onClick,
  onStartQuiz
}: {
  node: SkillTreeNode;
  theme?: any;
  onClick?: () => void;
  onStartQuiz?: () => void;
}) {
  const isLocked = node.status === "locked";
  const isCompleted = node.status === "completed";
  const isInProgress = node.status === "in-progress";
  const isAvailable = node.status === "available";

  const difficultyColors = {
    Mudah: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    Sedang: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    Sulit: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
  };

  // Get theme-specific styles
  const getCardStyle = () => {
    if (!theme) return {};
    
    if (isLocked) {
      return { 
        backgroundColor: theme.colors.nodeLocked,
        borderColor: theme.colors.nodeLocked 
      };
    }
    if (isCompleted) {
      return { 
        backgroundColor: theme.colors.nodeCompleted + '20',
        borderColor: theme.colors.nodeCompleted,
        boxShadow: `0 0 20px ${theme.colors.glow}40`
      };
    }
    if (isInProgress || isAvailable) {
      return { 
        backgroundColor: theme.colors.nodeDefault,
        borderColor: theme.colors.secondary 
      };
    }
    return {};
  };

  const getIconForState = () => {
    if (!theme) return node.icon;
    if (isLocked) return getThemeIcon(theme, 'locked');
    if (isCompleted) return getThemeIcon(theme, 'completed');
    return getThemeIcon(theme, 'default');
  };

  // Wrap card with tooltip
  return (
    <NodeTooltip
      node={node}
      userProgress={{
        status: node.status || "locked",
        progress: node.progress || 0,
        stars: node.stars || 0,
        // @ts-ignore - lessonViewed might not be in type yet
        lessonViewed: node.lessonViewed
      }}
    >
      <Card
        className={cn(
          "transition-all hover:shadow-md cursor-pointer",
          isLocked && "opacity-60 cursor-not-allowed",
          !theme && isCompleted && "border-green-500 bg-green-50 dark:bg-green-950/20",
          !theme && isInProgress && "border-blue-500",
          !theme && isAvailable && "hover:border-primary",
          node.isCheckpoint && "ring-2 ring-yellow-400 dark:ring-yellow-600",
          theme && (isCompleted || isInProgress || isAvailable) && theme.animations.nodeHover
        )}
        style={getCardStyle()}
        onClick={!isLocked ? onClick : undefined}
      >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getIconForState()}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-sm leading-tight">{node.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{node.topicCode}</p>
            </div>
          </div>
          {node.isCheckpoint && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 text-xs">
              Checkpoint
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {node.description}
        </p>

        {/* Progress bar for in-progress nodes */}
        {isInProgress && node.progress !== undefined && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{node.progress}%</span>
            </div>
            <Progress value={node.progress} className="h-1.5" />
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={difficultyColors[node.difficulty]}>
              {node.difficulty}
            </Badge>
            <span className="text-muted-foreground">{node.quizCount} soal</span>
            <span className="text-muted-foreground">{node.estimatedMinutes} min</span>
          </div>
        </div>

        {/* Rewards */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-amber-600">+{node.rewards.xp} XP</span>
            <span className="text-muted-foreground">💎 {node.rewards.gems}</span>
            {node.rewards.hearts && (
              <span className="text-muted-foreground">❤️ {node.rewards.hearts}</span>
            )}
          </div>

          {!isLocked && !isCompleted && (
            <Button
              size="sm"
              variant={isAvailable || isInProgress ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                onStartQuiz?.();
              }}
              className="h-7 text-xs"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              {isInProgress ? "Lanjutkan" : "Mulai"}
            </Button>
          )}

          {isCompleted && (
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={cn(
                  "text-base",
                  i < (node.stars || 0) ? "text-yellow-500" : "text-gray-300 dark:text-gray-700"
                )}>
                  ⭐
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Badge reward */}
        {isCompleted && node.rewards.badge && (
          <Badge variant="outline" className="w-full justify-center text-xs">
            🏆 {node.rewards.badge}
          </Badge>
        )}
      </CardContent>
    </Card>
    </NodeTooltip>
  );
}
