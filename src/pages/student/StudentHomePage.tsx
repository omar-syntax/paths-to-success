import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { demoProjects } from '@/data/demoData';
import { useToast } from '@/hooks/use-toast';

export default function StudentHomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'closing-soon' | 'closed'>('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredProjects = demoProjects.filter(project => {
    const matchesSearch = project.title.includes(searchTerm) || project.description.includes(searchTerm);
    const matchesFilter = filter === 'all' || project.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (projectId: string) => {
    toast({
      title: 'قريباً',
      description: 'صفحة تفاصيل المشروع والتسجيل قيد التطوير',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            المشاريع والمسابقات المتاحة
          </h1>
          <p className="text-muted-foreground mt-1">
            استكشف الفرص المتاحة وسجل في المشاريع التي تناسبك
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن مشروع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'الكل' },
            { key: 'open', label: 'مفتوح' },
            { key: 'closing-soon', label: 'يغلق قريباً' },
            { key: 'closed', label: 'مغلق' },
          ].map(f => (
            <Button
              key={f.key}
              variant={filter === f.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.key as typeof filter)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProjectCard
                project={project}
                onViewDetails={() => handleViewDetails(project.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">لا توجد مشاريع تطابق البحث</p>
        </div>
      )}
    </div>
  );
}
