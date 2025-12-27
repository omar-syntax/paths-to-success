import React from 'react';
import { FileUp, RefreshCw, Star, MessageSquare, Edit } from 'lucide-react';
import { ActivityLogEntry } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityLogProps {
  activities: ActivityLogEntry[];
}

const actionIcons: Record<ActivityLogEntry['action'], React.ReactNode> = {
  file_uploaded: <FileUp className="w-4 h-4 text-blue-500" />,
  status_changed: <RefreshCw className="w-4 h-4 text-orange-500" />,
  rating_added: <Star className="w-4 h-4 text-yellow-500" />,
  rating_edited: <Edit className="w-4 h-4 text-yellow-600" />,
  comment_added: <MessageSquare className="w-4 h-4 text-green-500" />,
  comment_edited: <Edit className="w-4 h-4 text-green-600" />,
};

const actionLabels: Record<ActivityLogEntry['action'], string> = {
  file_uploaded: 'File Uploaded',
  status_changed: 'Status Changed',
  rating_added: 'Rating Added',
  rating_edited: 'Rating Edited',
  comment_added: 'Comment Added',
  comment_edited: 'Comment Edited',
};

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ActivityLog({ activities }: ActivityLogProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <RefreshCw className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No activity recorded yet.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-3">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="mt-0.5">
              {actionIcons[activity.action]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm text-foreground">
                  {actionLabels[activity.action]}
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDateTime(activity.performedAt)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                By: {activity.performedBy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
