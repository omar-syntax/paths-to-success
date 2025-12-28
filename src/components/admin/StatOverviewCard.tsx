import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatOverviewCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  colorClass?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatOverviewCard({ 
  title, 
  value, 
  icon: Icon, 
  colorClass = 'text-primary',
  trend 
}: StatOverviewCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={cn(
                "text-xs",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </p>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-xl bg-muted/50",
            colorClass
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
