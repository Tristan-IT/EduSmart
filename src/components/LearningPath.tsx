/**
 * LearningPath Component - Duolingo-style Skill Tree
 * Vertical scrolling path with nodes and connecting lines
 * Now with subject grouping support
 */

import { motion } from "framer-motion";
import { SkillNode } from "./SkillNode";
import { Badge } from "@/components/ui/badge";
import { SkillTreeNode, SkillTreePath, updateNodeStatuses, updatePathStatuses } from "@/data/skillTree";
import { UserProgress } from "@/data/skillTree";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";

interface LearningPathProps {
  nodes: SkillTreeNode[];
  paths: SkillTreePath[];
  userProgress: UserProgress[];
  onNodeClick: (nodeId: string) => void;
  className?: string;
  subjectFilter?: string | null;
  subjectInfo?: {
    name: string;
    color: string;
    description?: string;
  };
  groupBySubject?: boolean;
}

export function LearningPath({
  nodes,
  paths,
  userProgress,
  onNodeClick,
  className,
  subjectFilter,
  subjectInfo,
  groupBySubject = false,
}: LearningPathProps) {
  // Update node statuses based on user progress
  const updatedNodes = updateNodeStatuses(nodes, userProgress);
  
  // Filter nodes by subject if filter is applied
  const filteredNodes = subjectFilter
    ? updatedNodes.filter(node => node.subject === subjectFilter)
    : updatedNodes;
  
  // Update path activation based on completed nodes
  const completedNodeIds = userProgress
    .filter(p => p.status === 'completed')
    .map(p => p.nodeId);
  const updatedPaths = updatePathStatuses(paths, completedNodeIds);

  return (
    <div className={cn("relative w-full py-6", className)}>
      {/* Subject Header */}
      {subjectInfo && (
        <motion.div
          className="max-w-xl mx-auto px-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="p-4 rounded-lg border-2 shadow-sm"
            style={{ borderColor: subjectInfo.color + '40', backgroundColor: subjectInfo.color + '10' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: subjectInfo.color + '20' }}
              >
                <GraduationCap className="h-6 w-6" style={{ color: subjectInfo.color }} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {subjectInfo.name}
                  <Badge
                    variant="outline"
                    style={{ borderColor: subjectInfo.color, color: subjectInfo.color }}
                  >
                    {filteredNodes.length} Pelajaran
                  </Badge>
                </h3>
                {subjectInfo.description && (
                  <p className="text-sm text-muted-foreground">{subjectInfo.description}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Clean vertical layout without connecting lines */}
      <div className="relative w-full mx-auto max-w-xl px-4">
        {filteredNodes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Belum ada pelajaran untuk mata pelajaran ini</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {filteredNodes.map((node, index) => {
            const progress = userProgress.find(p => p.nodeId === node.id);
            const isCheckpoint = node.isCheckpoint;
            
            return (
              <div key={node.id} className="relative flex flex-col items-center w-full">
                {/* Checkpoint separator */}
                {isCheckpoint && index > 0 && (
                  <motion.div
                    className="w-full flex items-center justify-center mb-6 mt-6"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-yellow-400/30 max-w-[180px]" />
                    <div className="mx-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full text-[10px] font-bold text-white shadow-md">
                      ⭐ CHECKPOINT
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-yellow-400/30 to-yellow-400/30 max-w-[180px]" />
                  </motion.div>
                )}

                {/* Node container */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 120,
                  }}
                  className="relative"
                >
                  <SkillNode
                    id={node.id}
                    title={node.title}
                    categoryName={node.categoryName}
                    status={node.status}
                    stars={progress?.stars ?? node.stars}
                    xpReward={node.xpReward}
                    isCheckpoint={node.isCheckpoint}
                    difficulty={node.difficulty}
                    description={node.description}
                    position={node.position}
                    onClick={() => onNodeClick(node.id)}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>
        )}

        {/* Progress indicator on the side */}
        <div className="absolute -left-8 top-0 bottom-0 w-1 rounded-full bg-muted/30 overflow-hidden hidden xl:block">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-purple-500 to-primary/50"
            initial={{ height: "0%" }}
            animate={{
              height: `${filteredNodes.length > 0 ? (userProgress.filter(p => p.status === 'completed' && filteredNodes.some(n => n.id === p.nodeId)).length / filteredNodes.length) * 100 : 0}%`
            }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
