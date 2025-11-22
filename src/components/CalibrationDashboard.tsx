import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCalibrationSuggestions,
  useCalibrateNode,
  useAutoCalibrate,
  useDifficultyDistribution,
  type NodePerformanceMetrics,
  type DifficultyAdjustment
} from '@/hooks/useCalibration';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Award,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500',
  intermediate: 'bg-blue-500',
  advanced: 'bg-purple-500',
  expert: 'bg-orange-500',
  hard: 'bg-red-500'
};

const difficultyLabels: Record<string, string> = {
  beginner: 'Pemula',
  intermediate: 'Menengah',
  advanced: 'Lanjutan',
  expert: 'Ahli',
  hard: 'Sulit'
};

export default function CalibrationDashboard() {
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [minStudents, setMinStudents] = useState(10);
  const { toast } = useToast();

  const { suggestions, loading: loadingSuggestions, refresh: refreshSuggestions } = 
    useCalibrationSuggestions(selectedSubject, minStudents);
  const { distribution, loading: loadingDistribution } = useDifficultyDistribution(selectedSubject);
  const { calibrate, loading: calibrating } = useCalibrateNode();
  const { autoCalibrate, loading: autoCalibrating } = useAutoCalibrate();

  const handleApplyCalibration = async (suggestion: NodePerformanceMetrics) => {
    const result = await calibrate(suggestion.nodeId, suggestion.recommendedDifficulty);
    if (result) {
      toast({
        title: 'Kalibrasi Berhasil',
        description: `Node diperbarui dari ${difficultyLabels[result.oldDifficulty]} ke ${difficultyLabels[result.newDifficulty]}`,
      });
      refreshSuggestions();
    }
  };

  const handleAutoCalibrate = async (dryRun: boolean = false) => {
    const adjustments = await autoCalibrate(selectedSubject, 20, dryRun);
    if (adjustments.length > 0) {
      toast({
        title: dryRun ? 'Simulasi Selesai' : 'Auto-Kalibrasi Selesai',
        description: `${adjustments.length} node ${dryRun ? 'akan' : 'telah'} disesuaikan`,
      });
      if (!dryRun) {
        refreshSuggestions();
      }
    } else {
      toast({
        title: 'Tidak Ada Penyesuaian',
        description: 'Semua node sudah sesuai dengan performa siswa',
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kalibrasi Kesulitan Node</h1>
          <p className="text-muted-foreground">
            Sesuaikan tingkat kesulitan node berdasarkan performa siswa
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleAutoCalibrate(true)}
            disabled={autoCalibrating}
          >
            <Activity className="w-4 h-4 mr-2" />
            Simulasi Auto-Kalibrasi
          </Button>
          <Button
            onClick={() => handleAutoCalibrate(false)}
            disabled={autoCalibrating}
          >
            <Zap className="w-4 h-4 mr-2" />
            {autoCalibrating ? 'Memproses...' : 'Auto-Kalibrasi'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList>
          <TabsTrigger value="suggestions">Saran Kalibrasi</TabsTrigger>
          <TabsTrigger value="distribution">Distribusi Kesulitan</TabsTrigger>
        </TabsList>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Node yang Memerlukan Penyesuaian</CardTitle>
              <CardDescription>
                Berdasarkan data performa dari minimal {minStudents} siswa
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSuggestions ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : suggestions.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Tidak ada node yang memerlukan penyesuaian saat ini. Semua node sudah sesuai dengan performa siswa.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((suggestion) => (
                    <CalibrationSuggestionCard
                      key={suggestion.nodeId}
                      suggestion={suggestion}
                      onApply={handleApplyCalibration}
                      applying={calibrating}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="space-y-4">
          {loadingDistribution ? (
            <Skeleton className="h-96 w-full" />
          ) : distribution ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Node</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{distribution.totalNodes}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Kesulitan Paling Umum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Object.entries(distribution.distribution)
                        .sort((a, b) => b[1] - a[1])[0]?.[0] || '-'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Variasi Kesulitan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {Object.keys(distribution.distribution).length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Distribusi Tingkat Kesulitan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(distribution.distribution).map(([difficulty, count]) => (
                    <div key={difficulty} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge className={difficultyColors[difficulty]}>
                            {difficultyLabels[difficulty] || difficulty}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {count} node ({Math.round((count / distribution.totalNodes) * 100)}%)
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          Rata-rata: {distribution.averageScoreByDifficulty[difficulty]?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <Progress 
                        value={(count / distribution.totalNodes) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CalibrationSuggestionCard({
  suggestion,
  onApply,
  applying
}: {
  suggestion: NodePerformanceMetrics;
  onApply: (suggestion: NodePerformanceMetrics) => void;
  applying: boolean;
}) {
  const isEasier = ['beginner', 'intermediate', 'advanced', 'expert', 'hard'].indexOf(
    suggestion.recommendedDifficulty
  ) < ['beginner', 'intermediate', 'advanced', 'expert', 'hard'].indexOf(
    suggestion.currentDifficulty
  );

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">Node ID: {suggestion.nodeId.slice(-8)}</CardTitle>
            <div className="flex gap-2">
              <Badge className={difficultyColors[suggestion.currentDifficulty]}>
                {difficultyLabels[suggestion.currentDifficulty]}
              </Badge>
              {isEasier ? (
                <TrendingDown className="w-4 h-4 text-blue-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-orange-500" />
              )}
              <Badge className={difficultyColors[suggestion.recommendedDifficulty]} variant="outline">
                Rekomendasi: {difficultyLabels[suggestion.recommendedDifficulty]}
              </Badge>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onApply(suggestion)}
            disabled={applying}
          >
            Terapkan
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Reason */}
        {suggestion.adjustmentReason && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{suggestion.adjustmentReason}</AlertDescription>
          </Alert>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<Users className="w-4 h-4" />}
            label="Siswa"
            value={suggestion.uniqueStudents}
          />
          <MetricCard
            icon={<Target className="w-4 h-4" />}
            label="Tingkat Selesai"
            value={`${suggestion.completionRate.toFixed(0)}%`}
            color={suggestion.completionRate >= 60 ? 'text-green-600' : 'text-red-600'}
          />
          <MetricCard
            icon={<Award className="w-4 h-4" />}
            label="Rata-rata Skor"
            value={`${suggestion.averageScore.toFixed(0)}%`}
            color={suggestion.averageScore >= 70 ? 'text-green-600' : 'text-orange-600'}
          />
          <MetricCard
            icon={<BarChart3 className="w-4 h-4" />}
            label="Skor Sempurna"
            value={`${suggestion.perfectScoreRate.toFixed(0)}%`}
          />
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Tingkat Penyelesaian</span>
              <span className="font-medium">{suggestion.completionRate.toFixed(1)}%</span>
            </div>
            <Progress value={suggestion.completionRate} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Rata-rata Percobaan</span>
              <span className="font-medium">{suggestion.averageAttempts.toFixed(1)}x</span>
            </div>
            <Progress value={Math.min((suggestion.averageAttempts / 5) * 100, 100)} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color = 'text-foreground'
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
