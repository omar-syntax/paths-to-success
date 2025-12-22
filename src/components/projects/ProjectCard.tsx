import React from 'react';
import { Calendar, Users, ArrowLeft, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onViewDetails?: () => void;
}

const statusConfig = {
  open: { label: 'مفتوح للتسجيل', variant: 'default' as const, className: 'bg-success text-success-foreground' },
  'closing-soon': { label: 'يغلق قريباً', variant: 'secondary' as const, className: 'bg-warning text-warning-foreground' },
  closed: { label: 'مغلق', variant: 'outline' as const, className: 'bg-muted text-muted-foreground' },
};

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const status = statusConfig[project.status];
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="overflow-hidden card-hover group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <Badge className={`absolute top-3 right-3 ${status.className}`}>
          {status.label}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(project.startDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(project.endDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{project.registeredCount} مسجل</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={onViewDetails}
          disabled={project.status === 'closed'}
          className="w-full group/btn"
        >
          <span>التفاصيل والتسجيل</span>
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover/btn:-translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
