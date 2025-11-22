import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle2, Circle, AlertCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PrerequisiteDetail } from '@/hooks/usePrerequisites';

interface PrerequisiteListProps {
  prerequisites: PrerequisiteDetail[];
  onNavigateToNode?: (nodeId: string) => void;
}

export const PrerequisiteList: React.FC<PrerequisiteListProps> = ({
  prerequisites,
  onNavigateToNode
}) => {
  if (prerequisites.length === 0) {
    return null;
  }

  const completedCount = prerequisites.filter(p => p.isCompleted).length;
  const progress = (completedCount / prerequisites.length) * 100;

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-lg">Prerequisites Required</CardTitle>
          </div>
          <Badge 
            variant={completedCount === prerequisites.length ? "default" : "secondary"}
            className={completedCount === prerequisites.length ? "bg-green-500" : ""}
          >
            {completedCount}/{prerequisites.length} Complete
          </Badge>
        </div>
        <CardDescription>
          Complete these nodes to unlock this lesson
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Prerequisite Items */}
        <div className="space-y-2">
          {prerequisites.map((prereq, index) => (
            <motion.div
              key={prereq.nodeId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                flex items-center justify-between p-3 rounded-lg border
                ${prereq.isCompleted 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200'
                }
              `}
            >
              <div className="flex items-center gap-3 flex-1">
                {prereq.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
                
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${
                    prereq.isCompleted ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    {prereq.title}
                  </p>
                  {prereq.isCompleted && prereq.score && (
                    <p className="text-sm text-green-700">
                      Completed with {prereq.score}% score
                    </p>
                  )}
                </div>
              </div>

              {!prereq.isCompleted && onNavigateToNode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigateToNode(prereq.nodeId)}
                  className="ml-2 text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                >
                  Start
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Completion Message */}
        {completedCount === prerequisites.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-3 bg-green-100 border border-green-200 rounded-lg"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-900">
              All prerequisites completed! You can now access this node.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

interface LockedNodeBadgeProps {
  lockReason?: string;
  missingCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const LockedNodeBadge: React.FC<LockedNodeBadgeProps> = ({
  lockReason,
  missingCount,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge 
      variant="outline" 
      className={`${sizeClasses[size]} border-orange-300 bg-orange-50 text-orange-700 flex items-center gap-1`}
    >
      <Lock className="w-3 h-3" />
      {lockReason || (missingCount ? `${missingCount} prerequisites required` : 'Locked')}
    </Badge>
  );
};

interface AccessDeniedMessageProps {
  lockReason?: string;
  prerequisites?: PrerequisiteDetail[];
  levelRequirement?: {
    required: number;
    current: number;
    isMet: boolean;
  };
  onNavigateToNode?: (nodeId: string) => void;
}

export const AccessDeniedMessage: React.FC<AccessDeniedMessageProps> = ({
  lockReason,
  prerequisites,
  levelRequirement,
  onNavigateToNode
}) => {
  return (
    <div className="space-y-4">
      {/* Main Lock Message */}
      <Card className="border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Lock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                This Node is Locked
              </h3>
              <p className="text-gray-700">
                {lockReason || 'Complete the required prerequisites to unlock this content.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Requirement */}
      {levelRequirement && !levelRequirement.isMet && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Level Requirement</p>
                <p className="text-sm text-blue-700">
                  Reach level {levelRequirement.required} to unlock (Current: {levelRequirement.current})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prerequisites List */}
      {prerequisites && prerequisites.length > 0 && (
        <PrerequisiteList 
          prerequisites={prerequisites}
          onNavigateToNode={onNavigateToNode}
        />
      )}
    </div>
  );
};

export default PrerequisiteList;
