import React from 'react';
import { Filter, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface StatisticsFiltersProps {
  projects: { id: string; title: string }[];
  selectedProject: string;
  selectedPeriod: string;
  onProjectChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onReset: () => void;
}

export function StatisticsFilters({
  projects,
  selectedProject,
  selectedPeriod,
  onProjectChange,
  onPeriodChange,
  onReset,
}: StatisticsFiltersProps) {
  const periods = [
    { value: 'all', label: 'كل الفترات' },
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'هذا الأسبوع' },
    { value: 'month', label: 'هذا الشهر' },
    { value: 'year', label: 'هذه السنة' },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">تصفية حسب:</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedProject} onValueChange={onProjectChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="اختر المشروع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المشاريع</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger className="w-[160px]">
                <Calendar className="w-4 h-4 ml-2" />
                <SelectValue placeholder="الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(selectedProject !== 'all' || selectedPeriod !== 'all') && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                إعادة تعيين
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
