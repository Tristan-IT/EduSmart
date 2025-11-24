import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EnhancedSkillTree, type SkillTreeNode } from "@/components/EnhancedSkillTree";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, Network, BookOpen, Trophy, Target } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import { AlertMessage } from "@/components/AlertMessage";
import RewardsModal from "@/components/RewardsModal";
import { useAchievements } from "@/hooks/useAchievements";
import { AchievementUnlock } from "@/components/AchievementUnlock";
import { NodePreviewModal } from "@/components/NodePreviewModal";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Badge } from "@/components/ui/badge";

export function SkillTreePage() {
  const [nodes, setNodes] = useState<SkillTreeNode[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<SkillTreeNode | null>(null);
  const [showRewards, setShowRewards] = useState(false);
  const [rewardsData, setRewardsData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  // Fetch skill tree data from backend
  useEffect(() => {
    fetchSkillTreeData();
  }, []);

  const fetchSkillTreeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use progress API to get nodes with user progress
      const response = await apiClient.get<{
        nodes: any[];
        stats: any;
      }>('/progress/skill-tree');

      if (response) {
        const { nodes: progressNodes, stats } = response;
        
        // Transform progress nodes to match SkillTreeNode interface
        const transformedNodes = progressNodes.map((node: any) => ({
          ...node,
          id: node.nodeId || node.id,
          status: node.progress?.status || 'locked',
          stars: node.progress?.stars || 0,
          completedAt: node.progress?.completedAt,
        }));
        
        setNodes(transformedNodes);
        
        // Build progress map (use id as key)
        const progressMap: Record<string, any> = {};
        transformedNodes.forEach((node: any) => {
          if (node.progress) {
            progressMap[node.id] = node.progress;
          }
        });
        setUserProgress(progressMap);
        
        console.log('Loaded nodes with progress:', stats);
      }
    } catch (err: any) {
      console.error('Error fetching skill tree:', err);
      setError(err.response?.data?.message || 'Gagal memuat skill tree');
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = async (node: SkillTreeNode) => {
    console.log('Node clicked:', node);
    setSelectedNode(node);
    setShowPreview(true);
  };

  const handleViewLesson = () => {
    if (!selectedNode) return;
    setShowPreview(false);
    navigate('/lesson', {
      state: { nodeId: selectedNode.id }
    });
  };

  const handleStartQuizFromPreview = async () => {
    if (!selectedNode) return;
    setShowPreview(false);
    await handleStartQuiz(selectedNode);
  };

  const handleStartQuiz = async (node: SkillTreeNode) => {
    try {
      setError(null);
      
      // First, unlock the node (or mark as in-progress)
      await apiClient.post('/progress/skill-tree/unlock', {
        nodeId: node.id
      });
      
      console.log('Node unlocked/started:', node.id);
      
      // Navigate to quiz player with node data
      navigate('/quiz-player', {
        state: {
          nodeId: node.id,
          nodeName: node.name,
          subject: node.subject,
          difficulty: node.difficulty,
          level: node.level,
          quizCount: node.quizCount || 10,
          // Pass node data for quiz generation
          topic: node.description || node.name,
        }
      });
      
    } catch (err: any) {
      console.error('Error starting quiz:', err);
      setError(err.response?.data?.message || 'Gagal memulai quiz');
    }
  };

  // Handle quiz completion (called from quiz player via state/callback)
  const handleQuizComplete = async (nodeId: string, score: number, timeSpent: number) => {
    try {
      setError(null);
      
      // Call complete API
      const response = await apiClient.post<{
        progress: any;
        rewards: any;
        userStats: any;
        recommendations?: any[];
        achievements?: {
          context: any;
          unlocked: string[];
        };
      }>('/progress/skill-tree/complete', {
        nodeId,
        score,
        timeSpent
      });
      
      const { progress, rewards, userStats, recommendations, achievements } = response;
      
      // Show rewards modal
      setRewardsData({
        rewards: {
          xp: rewards.xp || 0,
          gems: rewards.gems || 0,
          hearts: rewards.hearts || 0,
          badge: rewards.badge,
          certificate: rewards.certificate,
          stars: progress.stars,
          levelUp: rewards.levelUp,
          newLevel: userStats.level
        },
        userStats,
        nextRecommendations: recommendations || []
      });
      setShowRewards(true);
      
      // Refresh skill tree to show updated progress
      await fetchSkillTreeData();
      
    } catch (err: any) {
      console.error('Error completing node:', err);
      setError(err.response?.data?.message || 'Gagal menyimpan progress');
    }
  };

  const handleRewardsContinue = () => {
    setShowRewards(false);
    setRewardsData(null);
    // Could auto-navigate to next recommended node
  };

  // Calculate stats
  const totalNodes = nodes.length;
  const completedNodes = nodes.filter(n => n.status === 'completed').length;
  const inProgressNodes = nodes.filter(n => n.status === 'in-progress').length;
  const completionRate = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar role="student" />
        <main className="flex-1 w-full">
          <div className="flex items-center justify-center min-h-screen">
            <Card className="p-8 flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Memuat Skill Tree...</p>
            </Card>
          </div>
        </main>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar role="student" />
        <main className="flex-1 w-full">
          <div className="container mx-auto p-6 max-w-2xl">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <button 
              onClick={fetchSkillTreeData}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Coba Lagi
            </button>
          </div>
        </main>
      </SidebarProvider>
    );
  }

  if (nodes.length === 0) {
    return (
      <SidebarProvider>
        <AppSidebar role="student" />
        <main className="flex-1 w-full">
          <div className="container mx-auto p-6 max-w-2xl">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Belum ada skill tree yang tersedia. Silakan hubungi administrator.
              </p>
            </Card>
          </div>
        </main>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar role="student" />
      <main className="flex-1 w-full">
        {/* Header */}
        <motion.div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-3 flex-1">
              <Network className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Skill Tree Siswa
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container px-6 py-8 max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalNodes}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Semua skill nodes
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Selesai</CardTitle>
                  <Trophy className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{completedNodes}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Nodes completed
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sedang Berjalan</CardTitle>
                  <BookOpen className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{inProgressNodes}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Nodes in progress
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <Network className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Overall progress
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Alerts */}
          {error && <AlertMessage type="danger" message={error} onClose={() => setError(null)} />}
          {success && <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />}
          
          {/* Skill Tree */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card className="p-6">
              <EnhancedSkillTree
                nodes={nodes}
                userProgress={userProgress}
                onNodeClick={handleNodeClick}
                onStartQuiz={handleStartQuiz}
              />
            </Card>
          </motion.div>
        </div>
      </main>
      
      {/* Modals */}
      {showRewards && rewardsData && (
        <RewardsModal
          isOpen={showRewards}
          onClose={() => setShowRewards(false)}
          rewards={rewardsData.rewards}
          userStats={rewardsData.userStats}
          nextRecommendations={rewardsData.nextRecommendations}
          onContinue={handleRewardsContinue}
          nodeName={selectedNode?.name || 'Node'}
        />
      )}
      
      {showPreview && selectedNode && (
        <NodePreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          node={selectedNode}
          onViewLesson={handleViewLesson}
          onStartQuiz={handleStartQuizFromPreview}
        />
      )}
    </SidebarProvider>
  );
}
