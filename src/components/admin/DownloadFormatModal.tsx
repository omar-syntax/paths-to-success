import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Download, FileText, File, Loader2, AlertCircle } from 'lucide-react';
import { UploadedFile } from '@/types';
import { toast } from '@/hooks/use-toast';

interface DownloadFormatModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: UploadedFile;
  studentName: string;
  projectName: string;
}

type DownloadFormat = 'pdf' | 'docx' | 'original';

const DownloadFormatModal = ({ isOpen, onClose, file, studentName, projectName }: DownloadFormatModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>('original');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  };

  const originalExtension = getFileExtension(file.name);

  const isConversionSupported = (format: DownloadFormat) => {
    const supportedForPdf = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
    const supportedForDocx = ['doc', 'docx', 'txt', 'rtf', 'pdf'];
    
    if (format === 'original') return true;
    if (format === 'pdf') return supportedForPdf.includes(originalExtension);
    if (format === 'docx') return supportedForDocx.includes(originalExtension);
    return false;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      // Simulate file processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create filename in English format
      const cleanStudentName = studentName.replace(/\s+/g, '_');
      const cleanProjectName = projectName.replace(/\s+/g, '_');
      
      let extension = originalExtension;
      if (selectedFormat === 'pdf') extension = 'pdf';
      if (selectedFormat === 'docx') extension = 'docx';

      const fileName = `${cleanStudentName}_${cleanProjectName}.${extension}`;

      // Validate conversion is supported
      if (!isConversionSupported(selectedFormat)) {
        throw new Error(`تحويل الملف من ${originalExtension} إلى ${selectedFormat} غير مدعوم`);
      }

      // In a real implementation, this would call an API to convert and download the file
      // For demo purposes, we'll create a sample blob
      let content: Blob;
      let mimeType: string;

      if (selectedFormat === 'pdf') {
        // Simulated PDF content
        mimeType = 'application/pdf';
        content = new Blob(['%PDF-1.4\nSimulated PDF content for demo'], { type: mimeType });
      } else if (selectedFormat === 'docx') {
        // Simulated DOCX content
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        content = new Blob(['Simulated DOCX content for demo'], { type: mimeType });
      } else {
        // Original format
        mimeType = file.type || 'application/octet-stream';
        content = new Blob([`Original file content: ${file.name}`], { type: mimeType });
      }

      // Create download link
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'تم التحميل بنجاح',
        description: `تم تحميل الملف: ${fileName}`,
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل الملف');
    } finally {
      setIsDownloading(false);
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
