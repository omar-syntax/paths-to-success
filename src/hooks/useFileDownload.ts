import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Grade } from '@/types';
import { generateSubmissionPdf } from '@/utils/pdfGenerator';

// Only PDF format is supported
type DownloadFormat = 'pdf';

interface DownloadOptions {
  filePath: string;
  fileName: string;
  fileType: string;
  format: DownloadFormat;
  studentNameEn: string;
  projectNameEn: string;
}

export interface SubmissionData {
  studentName: string;
  studentEmail: string;
  projectTitle: string;
  submissionId: string;
  submissionDate: string;
  fileName: string;
  status: string;
  grade?: Grade;
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

// PDF is always the output format - no conversion needed

export function useFileDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Download file as PDF only with full submission details
  const downloadDemoFile = async (options: {
    fileName: string;
    fileType: string;
    format: DownloadFormat;
    studentNameEn: string;
    projectNameEn: string;
    fileUrl?: string;
    submissionData?: SubmissionData;
  }): Promise<boolean> => {
    const { studentNameEn, projectNameEn, submissionData } = options;
    
    setIsDownloading(true);
    setError(null);

    try {
      // Validate submission data exists
      if (!submissionData) {
        throw new Error('بيانات التقرير غير متوفرة');
      }

      // Create clean filename in English format
      const cleanStudentName = studentNameEn.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'Student';
      const cleanProjectName = projectNameEn.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'Project';
      const finalFileName = `${cleanStudentName}_${cleanProjectName}.pdf`;

      // Generate PDF with full content
      const pdfContent = generateSubmissionPdf(submissionData);
      
      // Validate PDF content
      if (!pdfContent || pdfContent.byteLength === 0) {
        throw new Error('فشل إنشاء ملف PDF');
      }

      const blob = new Blob([pdfContent], { type: 'application/pdf' });

      // Validate blob size
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

  return {
    isDownloading,
    error,
    downloadDemoFile,
  };
}
