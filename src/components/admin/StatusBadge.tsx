import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import { SubmissionStatus } from '@/types';

interface StatusBadgeProps {
  status: SubmissionStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<SubmissionStatus, { 
  label: string; 
  className: string; 
  icon: React.ReactNode;
}> = {
  'pending_review': { 
    label: 'قيد المراجعة', 
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    icon: <Clock className="w-3 h-3" />
  },
  'under_review': { 
    label: 'تحت المراجعة', 
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    icon: <Eye className="w-3 h-3" />
  },
  'graded': { 
    label: 'تم التقييم', 
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    icon: <CheckCircle className="w-3 h-3" />
  },
  'needs_resubmission': { 
    label: 'مطلوب إعادة رفع', 
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    icon: <AlertTriangle className="w-3 h-3" />
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'} gap-1.5 font-medium border`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}

export function getStatusLabel(status: SubmissionStatus): string {
  return statusConfig[status]?.label || status;
}

export const allStatuses: SubmissionStatus[] = ['pending_review', 'under_review', 'graded', 'needs_resubmission'];
