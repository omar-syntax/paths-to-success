import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type DownloadFormat = 'pdf' | 'docx' | 'original';

interface DownloadOptions {
  filePath: string;
  fileName: string;
  fileType: string;
  format: DownloadFormat;
  studentNameEn: string;
  projectNameEn: string;
}

// MIME type mapping
const MIME_TYPES: Record<string, string> = {
  'pdf': 'application/pdf',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'doc': 'application/msword',
  'txt': 'text/plain',
  'rtf': 'application/rtf',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'zip': 'application/zip',
};

// Check if conversion is supported
const isConversionSupported = (originalExt: string, targetFormat: DownloadFormat): boolean => {
  if (targetFormat === 'original') return true;
  
  const supportedForPdf = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  const supportedForDocx = ['doc', 'docx', 'txt', 'rtf'];
  
  if (targetFormat === 'pdf') return supportedForPdf.includes(originalExt.toLowerCase());
  if (targetFormat === 'docx') return supportedForDocx.includes(originalExt.toLowerCase());
  
  return false;
};

export function useFileDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const downloadFile = async (options: DownloadOptions): Promise<boolean> => {
    const { filePath, fileName, fileType, format, studentNameEn, projectNameEn } = options;
    
    setIsDownloading(true);
    setError(null);

    try {
      const originalExt = fileName.split('.').pop()?.toLowerCase() || '';
      
      // Check if conversion is supported
      if (!isConversionSupported(originalExt, format)) {
        // Download original and show warning
        toast({
          title: 'تحويل غير مدعوم',
          description: 'سيتم تحميل الملف الأصلي',
          variant: 'destructive',
        });
        // Continue with original format
      }

      // Download from Supabase storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('student-files')
        .download(filePath);

      if (downloadError) {
        throw new Error(`فشل تحميل الملف: ${downloadError.message}`);
      }

      // Determine final extension and MIME type
      let finalExtension = originalExt;
      let mimeType = fileType || MIME_TYPES[originalExt] || 'application/octet-stream';

      if (format === 'pdf' && isConversionSupported(originalExt, 'pdf')) {
        // For now, if file is already PDF, just download it
        // For real conversion, you'd need a backend service
        if (originalExt === 'pdf') {
          finalExtension = 'pdf';
          mimeType = MIME_TYPES['pdf'];
        } else {
          // If conversion is needed but not implemented, download original with warning
          toast({
            title: 'تنبيه',
            description: 'تحويل الملفات إلى PDF يتطلب خدمة خارجية. تم تحميل الملف الأصلي.',
          });
        }
      } else if (format === 'docx' && isConversionSupported(originalExt, 'docx')) {
        if (originalExt === 'docx') {
          finalExtension = 'docx';
          mimeType = MIME_TYPES['docx'];
        } else {
          toast({
            title: 'تنبيه',
            description: 'تحويل الملفات إلى Word يتطلب خدمة خارجية. تم تحميل الملف الأصلي.',
          });
        }
      }

      // Create clean filename in English format
      const cleanStudentName = studentNameEn.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      const cleanProjectName = projectNameEn.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      const finalFileName = `${cleanStudentName}_${cleanProjectName}.${finalExtension}`;

      // Create blob with correct MIME type
      const blob = new Blob([fileData], { type: mimeType });
      
      // Validate blob
      if (blob.size === 0) {
        throw new Error('الملف فارغ أو تالف');
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'تم التحميل بنجاح',
        description: `تم تحميل الملف: ${finalFileName}`,
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل الملف';
      setError(errorMessage);
      toast({
        title: 'خطأ في التحميل',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  // Download file from demo data (fallback for when no real storage is used)
  const downloadDemoFile = async (options: {
    fileName: string;
    fileType: string;
    format: DownloadFormat;
    studentNameEn: string;
    projectNameEn: string;
    fileUrl?: string;
  }): Promise<boolean> => {
    const { fileName, fileType, format, studentNameEn, projectNameEn, fileUrl } = options;
    
    setIsDownloading(true);
    setError(null);

    try {
      const originalExt = fileName.split('.').pop()?.toLowerCase() || '';
      
      // Determine final extension and MIME type
      let finalExtension = originalExt;
      let mimeType = fileType || MIME_TYPES[originalExt] || 'application/octet-stream';
      let conversionFailed = false;

      if (format === 'pdf') {
        if (originalExt === 'pdf') {
          finalExtension = 'pdf';
          mimeType = MIME_TYPES['pdf'];
        } else if (isConversionSupported(originalExt, 'pdf')) {
          // Simulate conversion - in real app, call conversion service
          conversionFailed = true;
        } else {
          conversionFailed = true;
        }
      } else if (format === 'docx') {
        if (originalExt === 'docx') {
          finalExtension = 'docx';
          mimeType = MIME_TYPES['docx'];
        } else if (isConversionSupported(originalExt, 'docx')) {
          conversionFailed = true;
        } else {
          conversionFailed = true;
        }
      }

      if (conversionFailed) {
        toast({
          title: 'فشل التحويل',
          description: 'تم تحميل الملف الأصلي بدلاً من ذلك',
        });
        // Reset to original format
        finalExtension = originalExt;
        mimeType = fileType || MIME_TYPES[originalExt] || 'application/octet-stream';
      }

      // Create clean filename in English format
      const cleanStudentName = studentNameEn.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      const cleanProjectName = projectNameEn.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      const finalFileName = `${cleanStudentName}_${cleanProjectName}.${finalExtension}`;

      // Create sample content based on MIME type
      let content: BlobPart;
      
      if (mimeType === 'application/pdf') {
        // Create minimal valid PDF
        content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
100 700 Td
(Demo File) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000214 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
307
%%EOF`;
      } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // For demo, create a simple text file (real DOCX needs proper structure)
        content = `Demo Word Document\n\nStudent: ${studentNameEn}\nProject: ${projectNameEn}\n\nThis is a demo file for testing purposes.`;
      } else {
        content = `Demo file content\n\nStudent: ${studentNameEn}\nProject: ${projectNameEn}\n\nOriginal file: ${fileName}`;
      }

      const blob = new Blob([content], { type: mimeType });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'تم التحميل بنجاح',
        description: `تم تحميل الملف: ${finalFileName}`,
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل الملف';
      setError(errorMessage);
      toast({
        title: 'خطأ في التحميل',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    error,
    downloadFile,
    downloadDemoFile,
  };
}
