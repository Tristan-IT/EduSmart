import { SkillTreeUnit, LessonChallenge } from "@/data/gamifiedLessons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, Flame, Lock, Play } from "lucide-react";

interface SkillTreeProps {
  units: SkillTreeUnit[];
  selectedLessonId?: string;
  onSelectLesson?: (lesson: LessonChallenge) => void;
  disabled?: boolean;
  variant?: "full" | "compact";
}

const lessonStatusStyles: Record<string, string> = {
  mastered: "bg-success/20 text-success border-success/40",
  completed: "bg-success/20 text-success border-success/40",
  "in-progress": "bg-primary/15 text-primary border-primary/30",
  available: "bg-card text-foreground border-primary/30",
  locked: "bg-muted text-muted-foreground border-transparent",
};

export const SkillTree = ({
  units,
  selectedLessonId,
  onSelectLesson,
  disabled = false,
  variant = "full",
}: SkillTreeProps) => {
  if (!units || units.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Skill tree belum tersedia.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", variant === "compact" && "space-y-4")}> 
      {units.map((unit) => {
        const unitProgressLessons = unit.skills.flatMap((skill) => skill.lessons);
        const masteredLessons = unitProgressLessons.filter((lesson) => lesson.status === "mastered").length;
        const unitProgress = Math.round((masteredLessons / (unitProgressLessons.length || 1)) * 100);

        return (
          <Card key={unit.id} className={cn("transition-all", unit.status === "current" && "border-primary shadow-lg")}> 
            <CardHeader className={cn("flex-row items-center justify-between", variant === "compact" ? "space-y-0" : "")}> 
              <div>
                <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
                  <span className="text-2xl" aria-hidden>{unit.icon}</span>
                  {unit.title}
                </CardTitle>
                {variant === "full" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {unit.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unit.status === "completed" && (
                  <Badge variant="secondary" className="bg-success/20 text-success">Selesai</Badge>
                )}
                {unit.status === "current" && (
                  <Badge variant="outline" className="border-primary text-primary">Sedang dipelajari</Badge>
                )}
                {unit.reward && (
                  <Badge variant="outline" className="border-accent text-accent">
                    {unit.reward.label}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className={cn("space-y-5", variant === "compact" && "space-y-4")}> 
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Progres Unit</span>
                  <span>{unitProgress}%</span>
                </div>
                <Progress value={unitProgress} className="h-2" />
              </div>
              <div className="space-y-5">
                {unit.skills.map((skill) => (
                  <div key={skill.id} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-11 h-11 rounded-2xl bg-muted flex items-center justify-center text-lg","shadow-sm",
                            skill.status === "completed" && "bg-success/20 text-success",
                            skill.status === "current" && "bg-primary/10 text-primary",
                            skill.status === "locked" && "opacity-60",
                          )}
                        >
                          {skill.status === "completed" ? <CheckCircle className="w-6 h-6" /> : skill.icon}
                        </div>
                        <div>
                          <p className="font-semibold leading-tight">{skill.title}</p>
                          {variant === "full" && (
                            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                              {skill.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            skill.status === "completed" && "border-success/40 text-success",
                            skill.status === "current" && "border-primary text-primary",
                            skill.status === "locked" && "border-muted text-muted-foreground",
                          )}
                        >
                          {skill.status === "completed" ? "Selesai" : skill.status === "current" ? "Aktif" : "Terkunci"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">Penguasaan {skill.mastery}%</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {skill.lessons.map((lesson) => {
                        const isSelected = selectedLessonId === lesson.id;
                        const isLocked = lesson.status === "locked";
                        const canInteract = !disabled && !isLocked && Boolean(onSelectLesson);
                        const statusKey = lesson.status as keyof typeof lessonStatusStyles;
                        return (
                          <Button
                            key={lesson.id}
                            type="button"
                            variant="outline"
                            disabled={!canInteract}
                            onClick={() => onSelectLesson?.(lesson)}
                            className={cn(
                              "group flex h-auto flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left shadow-sm transition-all",
                              lessonStatusStyles[statusKey] ?? "",
                              isSelected && "ring-2 ring-offset-2 ring-primary",
                              isLocked && "cursor-not-allowed opacity-65",
                              variant === "compact" && "px-3 py-2",
                            )}
                          >
                            <div className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wide">
                              <span>{lesson.type}</span>
                              <span className="flex items-center gap-1">
                                <Flame className={cn("h-3 w-3", lesson.status === "mastered" ? "text-warning" : "text-muted-foreground")}
                                />
                                {lesson.xpReward} XP
                              </span>
                            </div>
                            <p className="text-sm font-semibold leading-snug">{lesson.title}</p>
                            {variant === "full" && (
                              <p className="text-xs text-muted-foreground line-clamp-2">{lesson.description}</p>
                            )}
                            <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                              <span>{lesson.durationMinutes} menit</span>
                              {lesson.status === "locked" ? (
                                <span className="flex items-center gap-1">
                                  <Lock className="h-3 w-3" />
                                  Terkunci
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Play className="h-3 w-3" />
                                  {lesson.status === "mastered" ? "Ulangi" : "Mulai"}
                                </span>
                              )}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
