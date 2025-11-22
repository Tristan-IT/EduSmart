import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Lightbulb, 
  TrendingUp, 
  Star, 
  Clock, 
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface RecommendedNode {
  _id: string;
  nodeId: string;
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  xpReward: number;
  gemsReward: number;
  lessonContent?: {
    estimatedTime: number;
  };
  recommendationScore: number;
  recommendationReasons: string[];
}

interface RecommendationsData {
  recommendations: RecommendedNode[];
  insights: string[];
  userStats: {
    level: number;
    xp: number;
    completedNodes: number;
    currentStreak: number;
    strongSubjects: string[];
    preferredDifficulty: string;
  };
}

export const PathRecommendations: React.FC = () => {
  const [data, setData] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/progress/skill-tree/recommendations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (nodeId: string) => {
    navigate(`/skill-tree?node=${nodeId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-500',
      intermediate: 'bg-blue-500',
      advanced: 'bg-purple-500',
      expert: 'bg-orange-500',
      hard: 'bg-red-500'
    };
    return colors[difficulty] || 'bg-gray-500';
  };

  const getSubjectIcon = (subject: string) => {
    // You can customize icons per subject
    return <Sparkles className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={fetchRecommendations} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Insights Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <CardTitle className="text-lg">Personalized Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <TrendingUp className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
              <p>{insight}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* User Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{data.userStats.level}</p>
              <p className="text-sm text-gray-600">Level</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{data.userStats.completedNodes}</p>
              <p className="text-sm text-gray-600">Nodes Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl mb-2">🔥</div>
              <p className="text-2xl font-bold">{data.userStats.currentStreak}</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{data.userStats.xp}</p>
              <p className="text-sm text-gray-600">Total XP</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Nodes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Recommended for You
          </h3>
          <Badge variant="secondary">
            Top {data.recommendations.length} Picks
          </Badge>
        </div>

        {data.recommendations.map((node, index) => (
          <motion.div
            key={node._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`hover:shadow-lg transition-all cursor-pointer ${
                index === 0 ? 'border-purple-300 shadow-md' : ''
              }`}
              onClick={() => handleNodeClick(node._id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {index === 0 && (
                        <Badge className="bg-purple-500">
                          <Star className="w-3 h-3 mr-1" />
                          Top Pick
                        </Badge>
                      )}
                      <Badge 
                        className={`${getDifficultyColor(node.difficulty)} text-white capitalize`}
                      >
                        {node.difficulty}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {getSubjectIcon(node.subject)}
                        <span className="ml-1">{node.subject}</span>
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{node.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {node.description}
                    </CardDescription>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm text-gray-600">Match Score</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(node.recommendationScore)}%
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Recommendation Reasons */}
                <div className="space-y-2 mb-4">
                  {node.recommendationReasons.slice(0, 3).map((reason, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                {/* Rewards and Time */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Star className="w-4 h-4" />
                      <span className="font-semibold">+{node.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <Award className="w-4 h-4" />
                      <span className="font-semibold">+{node.gemsReward} Gems</span>
                    </div>
                    {node.lessonContent?.estimatedTime && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{node.lessonContent.estimatedTime} min</span>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Start Learning
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Strong Subjects Section */}
      {data.userStats.strongSubjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Strong Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.userStats.strongSubjects.map((subject) => (
                <Badge key={subject} variant="secondary" className="capitalize">
                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                  {subject}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={fetchRecommendations}
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Refresh Recommendations
        </Button>
      </div>
    </div>
  );
};

export default PathRecommendations;
