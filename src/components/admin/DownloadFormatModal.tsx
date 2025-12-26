import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Download, FileText, File, Loader2, AlertCircle } from 'lucide-react';
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

type DownloadFormat = 'pdf' | 'docx' | 'original';

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
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>('original');
  const { isDownloading, error, downloadDemoFile } = useFileDownload();

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  };

  const originalExtension = getFileExtension(file.name);

  // PDF is always supported since we generate it with submission data
  const isConversionSupported = (format: DownloadFormat) => {
    if (format === 'original') return true;
    if (format === 'pdf') return true; // Always supported - we generate full PDF
    if (format === 'docx') return true; // Always supported - we generate text content
    return false;
  };

  const handleDownload = async () => {
    // Build submission data for PDF/DOCX generation
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

    const success = await downloadDemoFile({
      fileName: file.name,
      fileType: file.type || 'application/octet-stream',
      format: selectedFormat,
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
            اختر صيغة التحميل
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">الملف: {file.name}</p>
            <p className="text-xs text-muted-foreground">الحجم: {file.size}</p>
          </div>

          <RadioGroup
            value={selectedFormat}
            onValueChange={(value) => setSelectedFormat(value as DownloadFormat)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="pdf" id="pdf" disabled={!isConversionSupported('pdf')} />
              <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                <FileText className="h-4 w-4 text-red-500" />
                PDF
                {!isConversionSupported('pdf') && (
                  <span className="text-xs text-muted-foreground">(غير مدعوم)</span>
                )}
              </Label>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="docx" id="docx" disabled={!isConversionSupported('docx')} />
              <Label htmlFor="docx" className="flex items-center gap-2 cursor-pointer">
                <FileText className="h-4 w-4 text-blue-500" />
                Word (DOCX)
                {!isConversionSupported('docx') && (
                  <span className="text-xs text-muted-foreground">(غير مدعوم)</span>
                )}
              </Label>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="original" id="original" />
              <Label htmlFor="original" className="flex items-center gap-2 cursor-pointer">
                <File className="h-4 w-4 text-gray-500" />
                الصيغة الأصلية ({originalExtension.toUpperCase()})
              </Label>
            </div>
          </RadioGroup>

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
                  جاري التحميل...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 ml-2" />
                  تحميل
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
