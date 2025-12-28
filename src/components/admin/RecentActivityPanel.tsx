import React from 'react';
import { FileUp, Star, MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Activity {
  id: string;
  type: 'file_upload' | 'rating' | 'comment';
  studentName: string;
  projectName: string;
  timestamp: string;
  details?: string;
}

interface RecentActivityPanelProps {
  activities: Activity[];
}

const activityConfig = {
  file_upload: {
    icon: FileUp,
    label: 'رفع ملف',
    colorClass: 'text-info bg-info/10',
  },
  rating: {
    icon: Star,
    label: 'تقييم جديد',
    colorClass: 'text-warning bg-warning/10',
  },
  comment: {
    icon: MessageSquare,
    label: 'تعليق جديد',
    colorClass: 'text-success bg-success/10',
  },
};

export function RecentActivityPanel({ activities }: RecentActivityPanelProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            النشاطات الأخيرة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            لا توجد نشاطات حالياً
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          النشاطات الأخيرة
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[320px]">
          <div className="divide-y divide-border">
            {activities.map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;
              
              return (
                <div key={activity.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-lg", config.colorClass)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm text-foreground truncate">
                          {activity.studentName}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(activity.timestamp), { 
                            addSuffix: true, 
                            locale: ar 
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {config.label} • {activity.projectName}
                      </p>
                      {activity.details && (
                        <p className="text-xs text-foreground/70 mt-1 truncate">
                          {activity.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
