import React from 'react';
import { X, Mail, Phone, School, Calendar, FileText, Download, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AvatarPlaceholder } from '@/components/ui/avatar-placeholder';
import { Registrant } from '@/data/demoData';
import { useToast } from '@/hooks/use-toast';

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrant: Registrant | null;
  onDownloadFile: (registrant: Registrant, fileId?: string) => void;
}

const statusConfig: Record<string, { className: string; icon: React.ReactNode }> = {
  'مسجل': { 
    className: 'bg-info text-info-foreground', 
    icon: <AlertCircle className="w-4 h-4" /> 
  },
  'جاري العمل': { 
    className: 'bg-warning text-warning-foreground', 
    icon: <Clock className="w-4 h-4" /> 
  },
  'تم التسليم': { 
    className: 'bg-success text-success-foreground', 
    icon: <CheckCircle className="w-4 h-4" /> 
  },
};

export function StudentDetailsModal({ 
  isOpen, 
  onClose, 
  registrant,
  onDownloadFile 
}: StudentDetailsModalProps) {
  const { toast } = useToast();

  if (!registrant) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePreviewFile = (file: { name: string; url: string }) => {
    // In a real app, this would open the file in a new tab or preview modal
    toast({
      title: 'معاينة الملف',
      description: `جاري فتح الملف: ${file.name}`,
    });
    // Simulate opening file preview
    window.open(file.url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>تفاصيل الطالب</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="p-6 space-y-6">
            {/* Student Info Header */}
            <div className="flex items-start gap-4">
              <AvatarPlaceholder name={registrant.name} size="lg" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">{registrant.name}</h3>
                <p className="text-muted-foreground text-sm" dir="ltr">{registrant.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={statusConfig[registrant.status]?.className}>
                    {statusConfig[registrant.status]?.icon}
                    <span className="mr-1">{registrant.status}</span>
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact & Education Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  معلومات الاتصال
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span dir="ltr">{registrant.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span dir="ltr">{registrant.phone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <School className="w-4 h-4 text-primary" />
                  المؤسسة التعليمية
                </h4>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm">{registrant.school}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Project Info */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                المشروع المسجل فيه
              </h4>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-medium text-foreground">{registrant.projectTitle}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>تاريخ التسجيل: {formatDate(registrant.registrationDate)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Uploaded Files */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  الملفات المرفوعة ({registrant.uploadedFiles.length})
                </h4>
                {registrant.uploadedFiles.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDownloadFile(registrant)}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    تحميل الكل
                  </Button>
                )}
              </div>

              {registrant.uploadedFiles.length > 0 ? (
                <div className="space-y-2">
                  {registrant.uploadedFiles.map((file) => (
                    <div 
                      key={file.id} 
                      className="flex items-center justify-between bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.size} • {formatDate(file.uploadDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="معاينة"
                          onClick={() => handlePreviewFile(file)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="تحميل"
                          onClick={() => onDownloadFile(registrant, file.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">لم يتم رفع أي ملفات بعد</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}