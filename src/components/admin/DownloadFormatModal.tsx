import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2, AlertCircle } from 'lucide-react';
import { UploadedFile, Grade } from '@/types';
import { useFileDownload, SubmissionData } from '@/hooks/useFileDownload';

interface DownloadFormatModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: UploadedFile;
  studentName: string;
  studentEmail?: string;
  projectName: string;
  submissionId?: string;
  submissionDate?: string;
  status?: string;
  grade?: Grade;
}

const DownloadFormatModal = ({ 
  isOpen, 
  onClose, 
  file, 
  studentName, 
  studentEmail = '',
  projectName,
  submissionId = '',
  submissionDate = '',
  status = '',
  grade,
}: DownloadFormatModalProps) => {
  const { isDownloading, error, downloadDemoFile } = useFileDownload();

  const handleDownload = async () => {
    // Build submission data for PDF generation
    const submissionData: SubmissionData = {
      studentName: studentName.replace(/_/g, ' '),
      studentEmail,
      projectTitle: projectName.replace(/_/g, ' '),
      submissionId,
      submissionDate,
      fileName: file.name,
      status,
      grade,
    };

    // Always generate PDF format only
    const success = await downloadDemoFile({
      fileName: file.name,
      fileType: 'application/pdf',
      format: 'pdf',
      studentNameEn: studentName,
      projectNameEn: projectName,
      fileUrl: file.url,
      submissionData,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            تحميل تقرير PDF
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">الملف: {file.name}</p>
            <p className="text-xs text-muted-foreground">الحجم: {file.size}</p>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium">تقرير PDF</span>
            </div>
            <p className="text-sm text-muted-foreground">
              سيتم إنشاء ملف PDF يحتوي على جميع بيانات الطالب والتقييم
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري إنشاء PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 ml-2" />
                  تحميل PDF
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isDownloading}>
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadFormatModal;
