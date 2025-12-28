import React from 'react';
import { Trophy, TrendingUp, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InsightItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

interface PerformanceInsightsProps {
  topProject: { name: string; count: number } | null;
  averageRating: number;
  activeStudentsToday: number;
  totalGraded: number;
}

export function PerformanceInsights({ 
  topProject, 
  averageRating, 
  activeStudentsToday,
  totalGraded 
}: PerformanceInsightsProps) {
  const insights: InsightItem[] = [
    {
      label: 'أعلى مشروع من حيث التسليمات',
      value: topProject ? `${topProject.name} (${topProject.count})` : 'لا توجد بيانات',
      icon: <Trophy className="w-5 h-5" />,
      colorClass: 'text-warning',
    },
    {
      label: 'متوسط التقييم العام',
      value: averageRating > 0 ? `${averageRating.toFixed(1)} / 100` : 'لا توجد تقييمات',
      icon: <Star className="w-5 h-5" />,
      colorClass: 'text-primary',
    },
    {
      label: 'الطلاب النشطين اليوم',
      value: activeStudentsToday,
      icon: <Users className="w-5 h-5" />,
      colorClass: 'text-success',
    },
    {
      label: 'إجمالي التقييمات المكتملة',
      value: totalGraded,
      icon: <TrendingUp className="w-5 h-5" />,
      colorClass: 'text-info',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          مؤشرات الأداء
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className={insight.colorClass}>
                {insight.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{insight.label}</p>
                <p className="font-semibold text-sm text-foreground truncate">{insight.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
