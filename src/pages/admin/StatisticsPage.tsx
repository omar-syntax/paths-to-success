import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Trophy,
  Users,
  FolderOpen,
  FileCheck,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { statisticsData, registrants, adminDemoProjects } from '@/data/demoData';
import { StatOverviewCard } from '@/components/admin/StatOverviewCard';
import { RecentActivityPanel } from '@/components/admin/RecentActivityPanel';
import { PerformanceInsights } from '@/components/admin/PerformanceInsights';
import { StatisticsFilters } from '@/components/admin/StatisticsFilters';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Arabic status labels for pie chart
const statusLabelsAr: Record<string, string> = {
  'pending_review': 'قيد المراجعة',
  'under_review': 'تحت المراجعة',
  'graded': 'تم التقييم',
  'needs_resubmission': 'مطلوب إعادة رفع',
};

const statusColors: Record<string, string> = {
  'pending_review': 'hsl(45, 93%, 47%)',
  'under_review': 'hsl(217, 91%, 60%)',
  'graded': 'hsl(142, 76%, 36%)',
  'needs_resubmission': 'hsl(0, 84%, 60%)',
};

export default function StatisticsPage() {
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Calculate stats from registrants data
  const stats = useMemo(() => {
    let filtered = registrants;
    
    // Filter by project
    if (selectedProject !== 'all') {
      filtered = filtered.filter(r => r.projectId === selectedProject);
    }
    
    // Filter by period
    if (selectedPeriod !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(r => {
        const date = new Date(r.registrationDate);
        switch (selectedPeriod) {
          case 'today':
            return date >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return date >= monthAgo;
          case 'year':
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return date >= yearAgo;
          default:
            return true;
        }
      });
    }

    const totalStudents = filtered.length;
    const totalSubmissions = filtered.filter(r => r.filesCount > 0).length;
    const pendingReview = filtered.filter(r => r.submissionStatus === 'pending_review').length;
    const underReview = filtered.filter(r => r.submissionStatus === 'under_review').length;
    const graded = filtered.filter(r => r.submissionStatus === 'graded').length;
    const needsResubmission = filtered.filter(r => r.submissionStatus === 'needs_resubmission').length;

    // Status distribution for pie chart
    const statusDistribution = [
      { status: 'قيد المراجعة', count: pendingReview, color: statusColors.pending_review },
      { status: 'تحت المراجعة', count: underReview, color: statusColors.under_review },
      { status: 'تم التقييم', count: graded, color: statusColors.graded },
      { status: 'مطلوب إعادة رفع', count: needsResubmission, color: statusColors.needs_resubmission },
    ].filter(s => s.count > 0);

    // Calculate average rating
    const gradedStudents = filtered.filter(r => r.grade);
    const averageRating = gradedStudents.length > 0
      ? gradedStudents.reduce((sum, r) => sum + (r.grade?.score || 0), 0) / gradedStudents.length
      : 0;

    // Top project by submissions
    const projectCounts = filtered.reduce((acc, r) => {
      if (r.filesCount > 0) {
        acc[r.projectTitle] = (acc[r.projectTitle] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const topProject = Object.entries(projectCounts).sort((a, b) => b[1] - a[1])[0];

    // Active students today (those with activity in last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const activeToday = filtered.filter(r => 
      r.lastActivity && new Date(r.lastActivity) >= oneDayAgo
    ).length;

    return {
      totalStudents,
      totalProjects: adminDemoProjects.length,
      totalSubmissions,
      pendingReview,
      underReview,
      graded,
      needsResubmission,
      statusDistribution,
      averageRating,
      topProject: topProject ? { name: topProject[0], count: topProject[1] } : null,
      activeToday,
    };
  }, [selectedProject, selectedPeriod]);

  // Generate recent activities from registrants
  const recentActivities = useMemo(() => {
    const activities: Array<{
      id: string;
      type: 'file_upload' | 'rating' | 'comment';
      studentName: string;
      projectName: string;
      timestamp: string;
      details?: string;
    }> = [];

    registrants.forEach(r => {
      // Add file uploads
      r.uploadedFiles.forEach(file => {
        activities.push({
          id: `file-${file.id}`,
          type: 'file_upload',
          studentName: r.name,
          projectName: r.projectTitle,
          timestamp: file.uploadDate + 'T12:00:00Z',
          details: file.name,
        });
      });

      // Add grades
      if (r.grade) {
        activities.push({
          id: `grade-${r.id}`,
          type: 'rating',
          studentName: r.name,
          projectName: r.projectTitle,
          timestamp: r.grade.gradedAt,
          details: `${r.grade.score}/${r.grade.maxScore}`,
        });
      }

      // Add comments from activity log
      r.activityLog?.filter(log => log.action === 'comment_added').forEach(log => {
        activities.push({
          id: log.id,
          type: 'comment',
          studentName: r.name,
          projectName: r.projectTitle,
          timestamp: log.performedAt,
        });
      });
    });

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, []);

  const handleResetFilters = () => {
    setSelectedProject('all');
    setSelectedPeriod('all');
  };

  const hasData = stats.totalStudents > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">الإحصائيات</h1>
        <p className="text-muted-foreground mt-1">تحليل شامل للمنصة</p>
      </div>

      {/* Filters */}
      <StatisticsFilters
        projects={adminDemoProjects.map(p => ({ id: p.id, title: p.title }))}
        selectedProject={selectedProject}
        selectedPeriod={selectedPeriod}
        onProjectChange={setSelectedProject}
        onPeriodChange={setSelectedPeriod}
        onReset={handleResetFilters}
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatOverviewCard
          title="إجمالي الطلاب المسجلين"
          value={stats.totalStudents}
          icon={Users}
          colorClass="text-primary"
        />
        <StatOverviewCard
          title="إجمالي المشاريع"
          value={stats.totalProjects}
          icon={FolderOpen}
          colorClass="text-info"
        />
        <StatOverviewCard
          title="عدد التسليمات"
          value={stats.totalSubmissions}
          icon={FileCheck}
          colorClass="text-success"
        />
        <StatOverviewCard
          title="قيد المراجعة"
          value={stats.pendingReview + stats.underReview}
          icon={Clock}
          colorClass="text-warning"
        />
        <StatOverviewCard
          title="تم التقييم"
          value={stats.graded}
          icon={CheckCircle}
          colorClass="text-success"
        />
      </div>

      {!hasData ? (
        <Card className="py-12">
          <CardContent className="text-center text-muted-foreground">
            <p className="text-lg">لا توجد بيانات حالياً</p>
            <p className="text-sm mt-2">قم بتغيير الفلاتر أو انتظر تسجيل طلاب جدد</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Performance Insights */}
          <PerformanceInsights
            topProject={stats.topProject}
            averageRating={stats.averageRating}
            activeStudentsToday={stats.activeToday}
            totalGraded={stats.graded}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution - Pie Chart */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-success" />
                  توزيع حالات التسليمات
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.statusDistribution.length > 0 ? (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.statusDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="count"
                          nameKey="status"
                          label={({ status, percent }) => `${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {stats.statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number, name: string) => [value, name]}
                        />
                        <Legend 
                          formatter={(value) => <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground">
                    لا توجد بيانات
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity Panel */}
            <RecentActivityPanel activities={recentActivities} />

            {/* Monthly Registrations - Line Chart */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  التسجيلات الشهرية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={statisticsData.monthlyRegistrations}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                        name="التسجيلات"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Projects Ranking - Bar Chart */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-warning" />
                  المشاريع الأكثر تسجيلاً
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statisticsData.projectsRanking} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke="hsl(var(--muted-foreground))"
                        width={100}
                        fontSize={11}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="hsl(var(--info))" 
                        radius={[0, 4, 4, 0]}
                        name="التسجيلات"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Registrations */}
            <Card className="animate-slide-up lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-info" />
                  التسجيلات الأسبوعية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statisticsData.weeklyRegistrations}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="day" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                        name="التسجيلات"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
