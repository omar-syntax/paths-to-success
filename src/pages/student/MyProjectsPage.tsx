import React from 'react';
import { Calendar, FileText, Lock, Upload, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { myProjects } from '@/data/demoData';
import { useToast } from '@/hooks/use-toast';

const statusConfig = {
  registered: { label: 'مسجل', className: 'bg-info text-info-foreground' },
  'in-progress': { label: 'جاري العمل', className: 'bg-warning text-warning-foreground' },
  submitted: { label: 'تم التسليم', className: 'bg-success text-success-foreground' },
};

export default function MyProjectsPage() {
  const { toast } = useToast();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleAction = (action: string) => {
    toast({
      title: 'قريباً',
      description: `${action} قيد التطوير`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">مشاريعي</h1>
        <p className="text-muted-foreground mt-1">المشاريع التي سجلت فيها</p>
      </div>

      {myProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((registration, index) => {
            const status = statusConfig[registration.status];
            const isSubmitted = registration.status === 'submitted';

            return (
              <Card
                key={registration.id}
                className="card-hover animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground line-clamp-2 flex-1">
                      {registration.projectTitle}
                    </h3>
                    <Badge className={`mr-2 flex-shrink-0 ${status.className}`}>
                      {isSubmitted && <Lock className="w-3 h-3 ml-1" />}
                      {status.label}
                    </Badge>
                  </div>

                  <div className="space-y-3 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>تاريخ التسجيل: {formatDate(registration.registrationDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>الملفات المرفوعة: {registration.filesCount}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAction('عرض التفاصيل')}
                    >
                      <Eye className="w-4 h-4 ml-1" />
                      التفاصيل
                    </Button>
                    {!isSubmitted && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAction('رفع ملفات')}
                      >
                        <Upload className="w-4 h-4 ml-1" />
                        رفع ملفات
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">لم تسجل في أي مشروع بعد</p>
          <Button className="mt-4" onClick={() => window.location.href = '/student'}>
            استكشف المشاريع المتاحة
          </Button>
        </div>
      )}
    </div>
  );
}
