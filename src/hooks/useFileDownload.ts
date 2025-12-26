import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Grade } from '@/types';
import { generateSubmissionPdf } from '@/utils/pdfGenerator';

type DownloadFormat = 'pdf' | 'docx' | 'original';

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

  // Download file from demo data with full submission details for PDF
  const downloadDemoFile = async (options: {
    fileName: string;
    fileType: string;
    format: DownloadFormat;
    studentNameEn: string;
    projectNameEn: string;
    fileUrl?: string;
    submissionData?: SubmissionData;
  }): Promise<boolean> => {
    const { fileName, fileType, format, studentNameEn, projectNameEn, submissionData } = options;
    
    setIsDownloading(true);
    setError(null);

    try {
      const originalExt = fileName.split('.').pop()?.toLowerCase() || '';
      
      // Create clean filename in English format
      const cleanStudentName = studentNameEn.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      const cleanProjectName = projectNameEn.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

      // Handle PDF format with full content
      if (format === 'pdf' && submissionData) {
        const pdfContent = generateSubmissionPdf(submissionData);
        const finalFileName = `${cleanStudentName}_${cleanProjectName}.pdf`;
        
        const blob = new Blob([pdfContent], { type: 'application/pdf' });

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
      }

      // Handle other formats
      let finalExtension = originalExt;
      let mimeType = fileType || MIME_TYPES[originalExt] || 'application/octet-stream';

      if (format === 'docx') {
        finalExtension = 'docx';
        mimeType = MIME_TYPES['docx'];
      } else if (format === 'original') {
        finalExtension = originalExt;
        mimeType = fileType || MIME_TYPES[originalExt] || 'application/octet-stream';
      }

      const finalFileName = `${cleanStudentName}_${cleanProjectName}.${finalExtension}`;

      // Create content based on format
      let content: string;
      
      if (format === 'docx' && submissionData) {
        // Create readable text document
        content = `STUDENT SUBMISSION REPORT
========================

STUDENT INFORMATION
-------------------
Full Name: ${submissionData.studentName}
Email: ${submissionData.studentEmail}

PROJECT INFORMATION
-------------------
Project Title: ${submissionData.projectTitle}

SUBMISSION DETAILS
------------------
Submission ID: ${submissionData.submissionId}
Submission Date: ${submissionData.submissionDate}
File Name: ${submissionData.fileName}
Status: ${submissionData.status}

GRADE & FEEDBACK
----------------
Grade: ${submissionData.grade ? `${submissionData.grade.score} / ${submissionData.grade.maxScore}` : 'Not graded yet'}
Feedback: ${submissionData.grade?.feedback || 'No feedback available'}
`;
      } else {
        content = `File: ${fileName}\nStudent: ${studentNameEn}\nProject: ${projectNameEn}`;
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
