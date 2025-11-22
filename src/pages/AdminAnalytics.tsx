import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  GraduationCap,
  BookOpen,
  Users,
  TrendingUp,
  Download,
  Building,
  Award,
  Target,
  School
} from "lucide-react";
import { subjectApi, progressApi } from "@/lib/apiClient";
import { toast } from "sonner";

interface SubjectStats {
  _id: string;
  code: string;
  name: string;
  category: string;
  color: string;
  schoolCount: number;
  studentCount: number;
  averageScore: number;
  completionRate: number;
  isCustom: boolean;
}

interface CategoryDistribution {
  category: string;
  count: number;
  percentage: number;
}

interface SchoolTypeStats {
  schoolType: string;
  totalSchools: number;
  totalSubjects: number;
  customSubjects: number;
  defaultSubjects: number;
}

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [subjectStats, setSubjectStats] = useState<SubjectStats[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution[]>([]);
  const [schoolTypeStats, setSchoolTypeStats] = useState<SchoolTypeStats[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [customSubjects, setCustomSubjects] = useState(0);
  const [activeSchools, setActiveSchools] = useState(0);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Load all subjects across schools
      const response = await subjectApi.getAll();
      const allSubjects = response.subjects;

      // Calculate total stats
      setTotalSubjects(allSubjects.length);
      setCustomSubjects(allSubjects.filter((s: any) => s.metadata?.isCustom).length);

      // Get unique schools
      const uniqueSchools = new Set(allSubjects.map((s: any) => s.school?._id || s.school));
      setActiveSchools(uniqueSchools.size);

      // Calculate category distribution
      const categoryCounts = allSubjects.reduce((acc: any, subject: any) => {
        acc[subject.category] = (acc[subject.category] || 0) + 1;
        return acc;
      }, {});

      const total = allSubjects.length;
      const distribution = Object.entries(categoryCounts).map(([category, count]: any) => ({
        category,
        count,
        percentage: (count / total) * 100
      }));
      setCategoryDistribution(distribution);

      // Group by school type (if available in subject data)
      const schoolTypeGroups: Record<string, any> = {};
      allSubjects.forEach((subject: any) => {
        const schoolType = subject.school?.schoolType || 'Unknown';
        if (!schoolTypeGroups[schoolType]) {
          schoolTypeGroups[schoolType] = {
            schoolType,
            schools: new Set(),
            totalSubjects: 0,
            customSubjects: 0,
            defaultSubjects: 0
          };
        }
        schoolTypeGroups[schoolType].schools.add(subject.school?._id || subject.school);
        schoolTypeGroups[schoolType].totalSubjects++;
        if (subject.metadata?.isCustom) {
          schoolTypeGroups[schoolType].customSubjects++;
        } else {
          schoolTypeGroups[schoolType].defaultSubjects++;
        }
      });

      const schoolTypeStatsArray = Object.values(schoolTypeGroups).map((group: any) => ({
        schoolType: group.schoolType,
        totalSchools: group.schools.size,
        totalSubjects: group.totalSubjects,
        customSubjects: group.customSubjects,
        defaultSubjects: group.defaultSubjects
      }));
      setSchoolTypeStats(schoolTypeStatsArray);

      // Calculate subject statistics (aggregated)
      const subjectGroups: Record<string, any> = {};
      allSubjects.forEach((subject: any) => {
        const key = `${subject.code}-${subject.name}`;
        if (!subjectGroups[key]) {
          subjectGroups[key] = {
            _id: subject._id,
            code: subject.code,
            name: subject.name,
            category: subject.category,
            color: subject.color,
            schoolCount: 0,
            studentCount: 0,
            averageScore: 0,
            completionRate: 0,
            isCustom: subject.metadata?.isCustom || false
          };
        }
        subjectGroups[key].schoolCount++;
      });

      setSubjectStats(Object.values(subjectGroups));

    } catch (error: any) {
      console.error('Failed to load analytics:', error);
      toast.error('Gagal memuat data analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Code', 'Name', 'Category', 'School Count', 'Is Custom'],
      ...subjectStats.map(s => [
        s.code,
        s.name,
        s.category,
        s.schoolCount.toString(),
        s.isCustom ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subject-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data berhasil diexport');
  };

  const exportToJSON = () => {
    const json = JSON.stringify({
      totalSubjects,
      customSubjects,
      activeSchools,
      categoryDistribution,
      schoolTypeStats,
      subjectStats
    }, null, 2);

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subject-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data berhasil diexport');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'WAJIB': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'PEMINATAN': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'MUATAN_LOKAL': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'EKSTRAKURIKULER': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
      default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  const filteredSubjects = selectedCategory === 'all'
    ? subjectStats
    : subjectStats.filter(s => s.category === selectedCategory);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen w-full flex bg-background">
          {/* @ts-ignore - admin role */}
          <AppSidebar role="admin" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat analytics...</p>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-background via-background to-primary/5">
        {/* @ts-ignore - admin role */}
        <AppSidebar role="admin" />
        
        <div className="flex-1">
          {/* Header */}
          <motion.header 
            className="sticky top-0 z-50 h-16 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex h-full items-center px-4 gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-3 flex-1">
                <motion.div
                  className="p-2 rounded-lg bg-gradient-to-br from-primary to-purple-600"
                  whileHover={{ scale: 1.05 }}
                >
                  <BarChart3 className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-lg font-semibold">Subject Analytics</h1>
                  <p className="text-xs text-muted-foreground">Analisis mata pelajaran across all schools</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToJSON}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  JSON
                </Button>
              </div>
            </div>
          </motion.header>

          {/* Main Content */}
          <main className="p-4 md:p-6 space-y-6">
            {/* Overview Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSubjects}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across all schools
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Custom Subjects</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customSubjects}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalSubjects > 0 ? ((customSubjects / totalSubjects) * 100).toFixed(1) : 0}% of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Active Schools</CardTitle>
                    <School className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeSchools}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Using subject system
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Avg Subjects/School</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activeSchools > 0 ? (totalSubjects / activeSchools).toFixed(1) : 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Per institution
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
                <TabsTrigger value="schools">Schools</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Category Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribution by Category</CardTitle>
                      <CardDescription>
                        Breakdown of subjects by category type
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {categoryDistribution.map((dist) => (
                        <div key={dist.category} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Badge className={getCategoryColor(dist.category)}>
                                {dist.category}
                              </Badge>
                            </div>
                            <span className="font-medium">
                              {dist.count} ({dist.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={dist.percentage} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* School Type Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle>By School Type</CardTitle>
                      <CardDescription>
                        Subject usage across different school types
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {schoolTypeStats.map((stats) => (
                          <div key={stats.schoolType} className="border rounded-lg p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{stats.schoolType}</span>
                              </div>
                              <Badge variant="outline">
                                {stats.totalSchools} {stats.totalSchools === 1 ? 'school' : 'schools'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground text-xs">Total</p>
                                <p className="font-semibold">{stats.totalSubjects}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Default</p>
                                <p className="font-semibold text-blue-600">{stats.defaultSubjects}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Custom</p>
                                <p className="font-semibold text-purple-600">{stats.customSubjects}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Subjects Tab */}
              <TabsContent value="subjects" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Subject List</CardTitle>
                        <CardDescription>
                          All subjects across the platform
                        </CardDescription>
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="WAJIB">Wajib</SelectItem>
                          <SelectItem value="PEMINATAN">Peminatan</SelectItem>
                          <SelectItem value="MUATAN_LOKAL">Muatan Lokal</SelectItem>
                          <SelectItem value="EKSTRAKURIKULER">Ekstrakurikuler</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {filteredSubjects.map((subject) => (
                        <div
                          key={subject._id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: subject.color }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{subject.name}</span>
                                {subject.isCustom && (
                                  <Badge variant="outline" className="text-xs">
                                    Custom
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-muted-foreground">
                                  {subject.code}
                                </span>
                                <Badge className={getCategoryColor(subject.category)}>
                                  {subject.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <School className="h-4 w-4" />
                              <span>{subject.schoolCount} {subject.schoolCount === 1 ? 'school' : 'schools'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {filteredSubjects.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No subjects found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Schools Tab */}
              <TabsContent value="schools" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>School Statistics</CardTitle>
                    <CardDescription>
                      Subject usage by school type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {schoolTypeStats.map((stats) => (
                        <Card key={stats.schoolType}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{stats.schoolType}</CardTitle>
                              <Badge>
                                {stats.totalSchools} {stats.totalSchools === 1 ? 'School' : 'Schools'}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Total Subjects</p>
                                <p className="text-2xl font-bold">{stats.totalSubjects}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Default Subjects</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.defaultSubjects}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Custom Subjects</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.customSubjects}</p>
                              </div>
                            </div>
                            <div className="mt-4 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Custom Ratio</span>
                                <span className="font-medium">
                                  {stats.totalSubjects > 0
                                    ? ((stats.customSubjects / stats.totalSubjects) * 100).toFixed(1)
                                    : 0}%
                                </span>
                              </div>
                              <Progress
                                value={stats.totalSubjects > 0
                                  ? (stats.customSubjects / stats.totalSubjects) * 100
                                  : 0}
                                className="h-2"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminAnalytics;
